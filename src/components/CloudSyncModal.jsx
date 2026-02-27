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
    signIn,
    signUp,
    signOut,
    syncNow,
  } = cloudSync;

  const signedIn = !!user;

  return (
    <ModalShell open={open} onClose={onClose}>
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
            background: "rgba(247,249,252,0.85)",
            border: "1px solid #e6e9ef",
            fontSize: 13,
            lineHeight: 1.35,
          }}
        >
          <div style={{ fontWeight: 900 }}>Status: {statusLabel(status)}</div>
          {signedIn ? <div style={{ marginTop: 3 }}>Signed in as {userEmail}</div> : <div style={{ marginTop: 3 }}>Not signed in</div>}
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

        {isConfigured && !signedIn && (
          <>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                onClick={() => setAuthMode("signin")}
                style={{
                  flex: 1,
                  background: authMode === "signin" ? "rgba(219,234,254,0.55)" : "#fff",
                  border: authMode === "signin" ? "1px solid rgba(37,99,235,0.2)" : undefined,
                }}
              >
                Sign in
              </Button>
              <Button
                onClick={() => setAuthMode("signup")}
                style={{
                  flex: 1,
                  background: authMode === "signup" ? "rgba(187,247,208,0.65)" : "#fff",
                  border: authMode === "signup" ? "1px solid rgba(16,185,129,0.25)" : undefined,
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
                  Sign in
                </Button>
              ) : (
                <Button onClick={signUp} disabled={!email || !password || isBusy} style={{ flex: 1 }}>
                  Create account
                </Button>
              )}
              <Button onClick={onClose} style={{ flex: 1, opacity: 0.85 }}>
                Close
              </Button>
            </div>
          </>
        )}

        {isConfigured && signedIn && (
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={syncNow} disabled={isBusy} style={{ flex: 1 }}>
              Sync now
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
            {error}
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
