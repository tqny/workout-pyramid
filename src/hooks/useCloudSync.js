import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { normalizeStore } from "../app/backup-utils";
import { normalizeReminderSettings } from "../app/reminder-utils";
import { isSupabaseConfigured, supabase } from "../app/supabase-client";

const SYNC_TABLE = "user_app_state";

function toAuthErrorMessage(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (text.includes("email not confirmed")) return "Email not confirmed yet. Use resend verification email below.";
  if (text.includes("user already registered")) return "This email already has an account. Sign in or reset password.";
  if (text.includes("password should be at least")) return "Password must be at least 6 characters.";
  if (text.includes("you can only request this after")) return "You requested this recently. Try again in about a minute.";
  return message || "Authentication failed. Please try again.";
}

function normalizeRemotePayload(row) {
  return {
    store: normalizeStore(row?.store || { days: {} }),
    reminders: normalizeReminderSettings(row?.reminders || {}),
    updatedAt: typeof row?.updated_at === "string" ? row.updated_at : null,
  };
}

export function useCloudSync({ store, remindersSettings, setStore, replaceReminderSettings, onNotice }) {
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(isSupabaseConfigured ? "idle" : "unconfigured");
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  const isConfigured = isSupabaseConfigured;
  const isBusy = status === "syncing" || status === "auth";
  const suppressUploadUntilRef = useRef(0);
  const lastUploadedPayloadRef = useRef("");
  const bootstrappedUserIdRef = useRef(null);
  const lastRemoteGuardAtRef = useRef(0);

  const payload = useMemo(
    () => ({ store: normalizeStore(store), reminders: normalizeReminderSettings(remindersSettings) }),
    [store, remindersSettings]
  );
  const payloadJson = useMemo(() => JSON.stringify(payload), [payload]);
  const payloadRef = useRef(payload);
  const payloadJsonRef = useRef(payloadJson);

  useEffect(() => {
    payloadRef.current = payload;
    payloadJsonRef.current = payloadJson;
  }, [payload, payloadJson]);

  const pullFromCloud = useCallback(
    async (userId) => {
      if (!isConfigured || !userId) return false;

      setStatus("syncing");
      setError("");

      const { data, error: fetchError } = await supabase
        .from(SYNC_TABLE)
        .select("store, reminders, updated_at")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        setStatus("error");
        setError(fetchError.message || "Failed to fetch cloud data.");
        return false;
      }

      if (!data) {
        setStatus("idle");
        return false;
      }

      try {
        const normalized = normalizeRemotePayload(data);
        suppressUploadUntilRef.current = Date.now() + 3000;
        setStore(normalized.store);
        replaceReminderSettings(normalized.reminders);

        const normalizedJson = JSON.stringify({
          store: normalized.store,
          reminders: normalized.reminders,
        });
        lastUploadedPayloadRef.current = normalizedJson;
        payloadJsonRef.current = normalizedJson;

        setLastSyncedAt(normalized.updatedAt || new Date().toISOString());
        setStatus("idle");
        return true;
      } catch (parseError) {
        setStatus("error");
        setError(parseError?.message || "Cloud data could not be parsed.");
        return false;
      }
    },
    [isConfigured, replaceReminderSettings, setStore]
  );

  const bootstrapCloudRow = useCallback(
    async (userId) => {
      if (!isConfigured || !userId) return false;

      const currentPayload = payloadRef.current;
      const draft = {
        user_id: userId,
        store: currentPayload.store,
        reminders: currentPayload.reminders,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError, data } = await supabase
        .from(SYNC_TABLE)
        .upsert(draft, { onConflict: "user_id" })
        .select("updated_at")
        .single();

      if (upsertError) {
        setStatus("error");
        setError(upsertError.message || "Could not initialize cloud sync.");
        return false;
      }

      lastUploadedPayloadRef.current = JSON.stringify({
        store: draft.store,
        reminders: draft.reminders,
      });
      setLastSyncedAt(data?.updated_at || draft.updated_at);
      setStatus("idle");
      return true;
    },
    [isConfigured]
  );

  const pushToCloud = useCallback(
    async (reason = "manual") => {
      if (!isConfigured || !user) return false;
      if (Date.now() < suppressUploadUntilRef.current) return false;

      const currentPayload = payloadRef.current;
      const normalizedPayload = {
        user_id: user.id,
        store: currentPayload.store,
        reminders: currentPayload.reminders,
        updated_at: new Date().toISOString(),
      };

      const nextPayloadJson = JSON.stringify({
        store: normalizedPayload.store,
        reminders: normalizedPayload.reminders,
      });
      if (reason === "auto" && nextPayloadJson === lastUploadedPayloadRef.current) {
        return false;
      }

      const shouldGuardRemote = reason === "manual" || Date.now() - lastRemoteGuardAtRef.current > 15000;
      if (shouldGuardRemote) {
        lastRemoteGuardAtRef.current = Date.now();
        const { data: remoteData, error: remoteFetchError } = await supabase
          .from(SYNC_TABLE)
          .select("store, reminders, updated_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (remoteFetchError) {
          setStatus("error");
          setError(remoteFetchError.message || "Failed to compare cloud state.");
          return false;
        }

        if (remoteData) {
          const remote = normalizeRemotePayload(remoteData);
          const remotePayloadJson = JSON.stringify({
            store: remote.store,
            reminders: remote.reminders,
          });
          const remoteUpdatedAtMs = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
          const lastKnownSyncMs = lastSyncedAt ? Date.parse(lastSyncedAt) : 0;
          const remoteIsNewer = Number.isFinite(remoteUpdatedAtMs) && remoteUpdatedAtMs > (lastKnownSyncMs || 0) + 1000;
          const remoteChangedSinceLastUpload = remotePayloadJson !== lastUploadedPayloadRef.current;
          const localChangedSinceLastUpload = nextPayloadJson !== lastUploadedPayloadRef.current;

          if (remoteIsNewer && remoteChangedSinceLastUpload && localChangedSinceLastUpload) {
            setStatus("error");
            setError("Cloud has newer changes from another device. Pull latest before syncing again.");
            onNotice?.({
              tone: "warning",
              text: "Cloud conflict detected. Pull latest first, then retry sync.",
            });
            return false;
          }
        }
      }

      setStatus("syncing");
      setError("");

      const { data, error: upsertError } = await supabase
        .from(SYNC_TABLE)
        .upsert(normalizedPayload, { onConflict: "user_id" })
        .select("updated_at")
        .single();

      if (upsertError) {
        setStatus("error");
        setError(upsertError.message || "Failed to sync cloud data.");
        return false;
      }

      lastUploadedPayloadRef.current = nextPayloadJson;
      setLastSyncedAt(data?.updated_at || normalizedPayload.updated_at);
      setStatus("idle");
      return true;
    },
    [isConfigured, lastSyncedAt, onNotice, user]
  );

  useEffect(() => {
    if (!isConfigured) return undefined;

    let active = true;

    async function initialize() {
      setError("");
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (userError) {
        setStatus("error");
        setError(userError.message || "Failed to restore session.");
        return;
      }

      setUser(currentUser || null);
      setStatus("idle");

      if (currentUser) {
        const hadRemote = await pullFromCloud(currentUser.id);
        if (!hadRemote) {
          await bootstrapCloudRow(currentUser.id);
        }
        bootstrappedUserIdRef.current = currentUser.id;
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      setError("");
      setStatus("idle");

      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("reset");
        onNotice?.({
          tone: "info",
          text: "Recovery link detected. Set your new password now.",
        });
        return;
      }

      // Avoid full cloud pull/bootstrap churn for token refresh events.
      if (!nextUser || (event !== "SIGNED_IN" && event !== "INITIAL_SESSION")) {
        if (!nextUser) {
          setAuthMode("signin");
          setPassword("");
          setConfirmPassword("");
          bootstrappedUserIdRef.current = null;
        }
        return;
      }

      if (bootstrappedUserIdRef.current === nextUser.id && event === "INITIAL_SESSION") {
        return;
      }

      if (nextUser) {
        const hadRemote = await pullFromCloud(nextUser.id);
        if (!hadRemote) {
          await bootstrapCloudRow(nextUser.id);
        }
        bootstrappedUserIdRef.current = nextUser.id;
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [bootstrapCloudRow, isConfigured, onNotice, pullFromCloud]);

  useEffect(() => {
    if (!isConfigured || !user) return undefined;
    const timer = setTimeout(() => {
      pushToCloud("auto");
    }, 1200);
    return () => clearTimeout(timer);
  }, [isConfigured, payloadJson, pushToCloud, user]);

  function resolveRedirectOrigin() {
    return typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : undefined;
  }

  async function signIn() {
    if (!isConfigured) return false;
    setStatus("auth");
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setStatus("error");
      setError(toAuthErrorMessage(signInError.message || "Sign in failed."));
      return false;
    }
    setStatus("idle");
    setAuthMode("signin");
    return true;
  }

  async function signUp() {
    if (!isConfigured) return false;
    setStatus("auth");
    setError("");
    const emailRedirectTo = resolveRedirectOrigin();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });
    if (signUpError) {
      setStatus("error");
      setError(toAuthErrorMessage(signUpError.message || "Sign up failed."));
      return false;
    }

    setStatus("idle");
    setAuthMode("signin");
    if (!data.session) {
      onNotice?.({
        tone: "info",
        text: "Check your email to confirm your account, then sign in.",
      });
    }
    return true;
  }

  async function sendPasswordReset() {
    if (!isConfigured) return false;
    if (!email.trim()) {
      setError("Enter your email first.");
      return false;
    }

    setStatus("auth");
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: resolveRedirectOrigin(),
    });

    if (resetError) {
      setStatus("error");
      setError(toAuthErrorMessage(resetError.message || "Could not send password reset email."));
      return false;
    }

    setStatus("idle");
    onNotice?.({
      tone: "info",
      text: "Password reset email sent. Open it and return here to set a new password.",
    });
    return true;
  }

  async function resendVerificationEmail() {
    if (!isConfigured) return false;
    if (!email.trim()) {
      setError("Enter your email first.");
      return false;
    }

    setStatus("auth");
    setError("");
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: resolveRedirectOrigin() },
    });

    if (resendError) {
      setStatus("error");
      setError(toAuthErrorMessage(resendError.message || "Could not resend verification email."));
      return false;
    }

    setStatus("idle");
    onNotice?.({
      tone: "info",
      text: "Verification email sent. Check inbox and spam.",
    });
    return true;
  }

  async function updateRecoveredPassword() {
    if (!isConfigured) return false;
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setStatus("auth");
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setStatus("error");
      setError(toAuthErrorMessage(updateError.message || "Could not update password."));
      return false;
    }

    setStatus("idle");
    setAuthMode("signin");
    setPassword("");
    setConfirmPassword("");
    onNotice?.({
      tone: "positive",
      text: "Password updated. Sign in with your new password.",
    });
    return true;
  }

  async function signOut() {
    if (!isConfigured) return;
    setStatus("auth");
    setError("");
    await supabase.auth.signOut();
    setUser(null);
    setStatus("idle");
    setAuthMode("signin");
    setPassword("");
    setConfirmPassword("");
  }

  async function syncNow() {
    if (!user) return false;
    const success = await pushToCloud("manual");
    if (success) {
      onNotice?.({ tone: "positive", text: "Cloud sync complete." });
    }
    return success;
  }

  async function pullLatest() {
    if (!user) return false;
    const success = await pullFromCloud(user.id);
    if (success) {
      onNotice?.({ tone: "positive", text: "Pulled latest cloud data." });
    }
    return success;
  }

  return {
    isConfigured,
    user,
    userEmail: user?.email || "",
    status,
    isBusy,
    error,
    lastSyncedAt,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    signIn,
    signUp,
    sendPasswordReset,
    resendVerificationEmail,
    updateRecoveredPassword,
    signOut,
    syncNow,
    pullLatest,
  };
}
