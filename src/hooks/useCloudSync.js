import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { normalizeStore } from "../app/backup-utils";
import { normalizeReminderSettings } from "../app/reminder-utils";
import { isSupabaseConfigured, supabase } from "../app/supabase-client";

const SYNC_TABLE = "user_app_state";

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
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(isSupabaseConfigured ? "idle" : "unconfigured");
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  const isConfigured = isSupabaseConfigured;
  const isBusy = status === "syncing" || status === "auth";
  const suppressUploadUntilRef = useRef(0);
  const lastUploadedPayloadRef = useRef("");
  const bootstrappedUserIdRef = useRef(null);

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
    [isConfigured, user]
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

      // Avoid full cloud pull/bootstrap churn for token refresh events.
      if (!nextUser || (event !== "SIGNED_IN" && event !== "INITIAL_SESSION")) {
        if (!nextUser) {
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
  }, [bootstrapCloudRow, isConfigured, pullFromCloud]);

  useEffect(() => {
    if (!isConfigured || !user) return undefined;
    const timer = setTimeout(() => {
      pushToCloud("auto");
    }, 1200);
    return () => clearTimeout(timer);
  }, [isConfigured, payloadJson, pushToCloud, user]);

  async function signIn() {
    if (!isConfigured) return false;
    setStatus("auth");
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setStatus("error");
      setError(signInError.message || "Sign in failed.");
      return false;
    }
    setStatus("idle");
    return true;
  }

  async function signUp() {
    if (!isConfigured) return false;
    setStatus("auth");
    setError("");
    const emailRedirectTo =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : undefined;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });
    if (signUpError) {
      setStatus("error");
      setError(signUpError.message || "Sign up failed.");
      return false;
    }

    setStatus("idle");
    if (!data.session) {
      onNotice?.({
        tone: "info",
        text: "Check your email to confirm your account, then sign in.",
      });
    }
    return true;
  }

  async function signOut() {
    if (!isConfigured) return;
    setStatus("auth");
    setError("");
    await supabase.auth.signOut();
    setUser(null);
    setStatus("idle");
  }

  async function syncNow() {
    if (!user) return false;
    const success = await pushToCloud("manual");
    if (success) {
      onNotice?.({ tone: "positive", text: "Cloud sync complete." });
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
    signIn,
    signUp,
    signOut,
    syncNow,
  };
}
