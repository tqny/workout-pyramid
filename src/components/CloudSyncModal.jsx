import React from "react";
import { Button, ModalShell } from "./ui";

function statusLabel(status) {
  if (status === "syncing") return "Syncing";
  if (status === "auth") return "Authenticating";
  if (status === "error") return "Needs attention";
  if (status === "unconfigured") return "Not configured";
  return "Ready";
}

export function CloudSyncModal({ open, onClose, cloudSync }) {
  const {
    isConfigured,
    user,
    userEmail,
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
  } = cloudSync;

  const recoveryMode = authMode === "reset";
  const signedIn = !!user && !recoveryMode;
  const isSyncing = status === "syncing";
  const isAuthenticating = status === "auth";
  const isErrored = status === "error";
  const statusTone = isErrored
    ? {
        background: "rgba(254,202,202,0.55)",
        border: "1px solid rgba(239,68,68,0.28)",
        color: "#7f1d1d",
      }
    : isSyncing || isAuthenticating
      ? {
          background: "rgba(219,234,254,0.52)",
          border: "1px solid rgba(37,99,235,0.24)",
          color: "#1d4ed8",
        }
      : {
          background: "rgba(240,253,250,0.7)",
          border: "1px solid rgba(16,185,129,0.2)",
          color: "#065f46",
        };
  const statusDetail = isSyncing
    ? "Sync in progress. Keep this window open."
    : isAuthenticating
      ? "Authenticating account request."
      : isErrored
        ? "Action needed before sync can continue."
        : "Everything is ready.";
  const authLinkStyle = {
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    textAlign: "left",
  };
  const authTabActiveStyle = {
    background: "rgba(219,234,254,0.55)",
    border: "1px solid rgba(37,99,235,0.2)",
    boxShadow: "none",
  };
  const authTabIdleStyle = {
    background: "#fff",
    border: "1px solid #dfe5ee",
    boxShadow: "none",
  };

  return (
    <ModalShell open={open} onClose={onClose} ariaLabel="Cloud sync">
      <div style={{ padding: 18, borderBottom: "1px solid #e6e9ef", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Cloud sync</div>
          <div style={{ fontSize: 12, opacity: 0.68, marginTop: 2 }}>
            Sync workouts and reminder settings across browsers and devices.
          </div>
        </div>
        <button
          type="button"
          aria-label="Close cloud sync"
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            border: "1px solid #e6e9ef",
            background: "#ffffff",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: 18, display: "grid", gap: 14 }}>
        <div
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            ...statusTone,
            fontSize: 13,
            lineHeight: 1.35,
          }}
        >
          <div style={{ fontWeight: 800 }}>Status: {statusLabel(status)}</div>
          <div style={{ marginTop: 3, fontWeight: 600 }}>{statusDetail}</div>
          {userEmail ? (
            <div style={{ marginTop: 3 }}>Signed in as {userEmail}</div>
          ) : email ? (
            <div style={{ marginTop: 3 }}>Email: {email}</div>
          ) : (
            <div style={{ marginTop: 3 }}>Not signed in</div>
          )}
          {recoveryMode ? <div style={{ marginTop: 3, fontWeight: 800 }}>Password recovery in progress</div> : null}
          {lastSyncedAt ? <div style={{ marginTop: 3 }}>Last sync: {new Date(lastSyncedAt).toLocaleString()}</div> : null}
        </div>

        {!isConfigured && (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              background: "rgba(254,243,199,0.70)",
              border: "1px solid rgba(202,138,4,0.2)",
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            <div style={{ fontWeight: 900 }}>Cloud sync is not configured.</div>
            <div style={{ marginTop: 4 }}>Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment, then restart the app.</div>
          </div>
        )}

        {isConfigured && recoveryMode && (
          <>
            <div
              style={{
                borderRadius: 12,
                padding: "10px 12px",
                background: "rgba(219,234,254,0.55)",
                border: "1px solid rgba(37,99,235,0.18)",
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              Set a new password to complete recovery.
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>New password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Cloud sync new password"
                placeholder="At least 6 characters"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #e6e9ef",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Confirm password</div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Cloud sync confirm password"
                placeholder="Repeat password"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #e6e9ef",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={updateRecoveredPassword}
                disabled={!password || !confirmPassword || isBusy}
                style={{ flex: 1 }}
              >
                Update password
              </Button>
              <Button onClick={() => setAuthMode("signin")} style={{ flex: 1, opacity: 0.85 }}>
                Back to sign in
              </Button>
            </div>
          </>
        )}

        {isConfigured && !signedIn && !recoveryMode && (
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => setAuthMode("signin")}
                style={{
                  flex: 1,
                  ...(authMode === "signin" ? authTabActiveStyle : authTabIdleStyle),
                }}
              >
                Sign in
              </Button>
              <Button
                onClick={() => setAuthMode("signup")}
                style={{
                  flex: 1,
                  ...(authMode === "signup" ? authTabActiveStyle : authTabIdleStyle),
                }}
              >
                Create account
              </Button>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Cloud sync email"
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #e6e9ef",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Cloud sync password"
                placeholder="At least 6 characters"
                style={{
                  width: "100%",
                  borderRadius: 14,
                  border: "1px solid #e6e9ef",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {authMode === "signin" ? (
                <Button onClick={signIn} disabled={!email || !password || isBusy} style={{ flex: 1 }}>
                  {isAuthenticating ? "Signing in..." : "Sign in"}
                </Button>
              ) : (
                <Button onClick={signUp} disabled={!email || !password || isBusy} style={{ flex: 1 }}>
                  {isAuthenticating ? "Creating..." : "Create account"}
                </Button>
              )}
              <Button onClick={onClose} style={{ flex: 1, opacity: 0.85 }}>
                Close
              </Button>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
              <button
                type="button"
                onClick={sendPasswordReset}
                disabled={!email || isBusy}
                style={{ ...authLinkStyle, opacity: !email || isBusy ? 0.5 : 1, cursor: !email || isBusy ? "not-allowed" : "pointer" }}
              >
                Forgot password
              </button>
              <button
                type="button"
                onClick={resendVerificationEmail}
                disabled={!email || isBusy}
                style={{ ...authLinkStyle, opacity: !email || isBusy ? 0.5 : 1, cursor: !email || isBusy ? "not-allowed" : "pointer" }}
              >
                Resend verification email
              </button>
            </div>
          </>
        )}

        {isConfigured && signedIn && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button onClick={syncNow} disabled={isBusy} style={{ flex: 1 }}>
              {isSyncing ? "Syncing..." : "Sync now"}
            </Button>
            <Button onClick={pullLatest} disabled={isBusy} style={{ flex: 1, opacity: 0.9 }}>
              Pull latest
            </Button>
            <Button onClick={signOut} disabled={isBusy} style={{ flex: 1, opacity: 0.88 }}>
              Sign out
            </Button>
          </div>
        )}

        {error ? (
          <div
            style={{
              borderRadius: 12,
              padding: "9px 10px",
              background: "rgba(254,202,202,0.60)",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            <div>{error}</div>
            {signedIn ? (
              <div style={{ marginTop: 8 }}>
                <Button onClick={pullLatest} disabled={isBusy} style={{ width: "100%", minHeight: 38, opacity: 0.92 }}>
                  Pull latest from cloud
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
