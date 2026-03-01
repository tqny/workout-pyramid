import React from "react";
import { THEME } from "../app/theme";
import { Button } from "./ui";

export function AuthGate({ cloudSync, onContinue, onContinueGuest }) {
  const {
    isConfigured,
    user,
    userEmail,
    status,
    isBusy,
    error,
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
  } = cloudSync;

  const recoveryMode = authMode === "reset";
  const signedIn = !!user && !recoveryMode;
  const isAuthenticating = status === "auth";
  const authTabActiveStyle = {
    background: "linear-gradient(180deg, rgba(246,250,255,0.92) 0%, rgba(236,244,252,0.88) 100%)",
    border: "1px solid rgba(193,207,224,0.92)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
  };
  const authTabIdleStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(247,251,255,0.78) 100%)",
    border: "1px solid rgba(214,223,233,0.9)",
    boxShadow: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% 0%, rgba(255,255,255,0.98) 0%, rgba(246,252,255,0.95) 36%, rgba(236,245,252,0.92) 100%)",
        color: THEME.ink,
        fontFamily: THEME.font,
        display: "grid",
        placeItems: "center",
        padding: 22,
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          borderRadius: 24,
          border: "1px solid rgba(214,223,233,0.9)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(245,250,255,0.84) 100%)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 45px rgba(36, 60, 84, 0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 18,
            borderBottom: "1px solid rgba(214,223,233,0.8)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              border: "1px solid rgba(214,223,233,0.92)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,250,255,0.9) 100%)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2.5" y="2.5" width="23" height="23" rx="7" fill="#F7F9FC" stroke="#DFE5EE" />
              <path
                d="M7 17.5L11.2 12.2L14 15L17 10.5L21 17.5"
                stroke="#121826"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9.5 20.5H18.5" stroke="#121826" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <div style={{ lineHeight: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.1, opacity: 0.66 }}>WORKOUT</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>PYRAMID</div>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.6, marginTop: 8 }}>Plan. Commit. Confirm.</div>
          </div>
        </div>

        <div style={{ padding: 18, display: "grid", gap: 12 }}>
          {!isConfigured && (
            <div
              style={{
                borderRadius: 12,
                padding: "10px 12px",
                background: "linear-gradient(180deg, rgba(253,243,227,0.9) 0%, rgba(248,233,205,0.86) 100%)",
                border: "1px solid rgba(217,161,80,0.34)",
                fontSize: 13,
                lineHeight: 1.35,
              }}
            >
              Cloud login is not configured in this environment. You can still continue as guest.
            </div>
          )}

          {signedIn ? (
            <>
              <div
                style={{
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "linear-gradient(180deg, rgba(238,252,246,0.92) 0%, rgba(225,245,236,0.88) 100%)",
                  border: "1px solid rgba(102,166,126,0.26)",
                  fontSize: 13,
                  lineHeight: 1.35,
                }}
              >
                Signed in as {userEmail || "your account"}.
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <Button
                  onClick={onContinue}
                  style={{
                    width: "100%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(246,250,255,0.84) 100%)",
                  }}
                >
                  Continue
                </Button>
                <Button onClick={signOut} disabled={isBusy} style={{ width: "100%", opacity: 0.82 }}>
                  Sign out
                </Button>
              </div>
            </>
          ) : recoveryMode ? (
            <>
              <div
                style={{
                  borderRadius: 12,
                  padding: "10px 12px",
                  background: "linear-gradient(180deg, rgba(242,248,255,0.9) 0%, rgba(230,241,252,0.85) 100%)",
                  border: "1px solid rgba(178,197,220,0.36)",
                  fontSize: 13,
                  lineHeight: 1.35,
                }}
              >
                Set a new password to complete recovery.
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 6 }}>New password</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Cloud sync new password"
                  placeholder="At least 6 characters"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(214,223,233,0.95)",
                    background: "rgba(255,255,255,0.9)",
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 6 }}>Confirm password</div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-label="Cloud sync confirm password"
                  placeholder="Repeat password"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "1px solid rgba(214,223,233,0.95)",
                    background: "rgba(255,255,255,0.9)",
                    padding: "10px 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <Button onClick={updateRecoveredPassword} disabled={!password || !confirmPassword || isBusy} style={{ width: "100%" }}>
                  Update password
                </Button>
                <Button onClick={() => setAuthMode("signin")} style={{ width: "100%", opacity: 0.85 }}>
                  Back to sign in
                </Button>
                <Button onClick={onContinueGuest} style={{ width: "100%", opacity: 0.9 }}>
                  Use app as guest
                </Button>
              </div>
            </>
          ) : (
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

              {isConfigured && (
                <>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 6 }}>Email</div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Cloud sync email"
                      placeholder="you@example.com"
                      style={{
                        width: "100%",
                        borderRadius: 14,
                        border: "1px solid rgba(214,223,233,0.95)",
                        background: "rgba(255,255,255,0.9)",
                        padding: "10px 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, marginBottom: 6 }}>Password</div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-label="Cloud sync password"
                      placeholder="At least 6 characters"
                      style={{
                        width: "100%",
                        borderRadius: 14,
                        border: "1px solid rgba(214,223,233,0.95)",
                        background: "rgba(255,255,255,0.9)",
                        padding: "10px 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      onClick={authMode === "signin" ? signIn : signUp}
                      disabled={!email || !password || isBusy}
                      style={{
                        flex: 1,
                        ...(authMode === "signin" ? authTabActiveStyle : authTabIdleStyle),
                      }}
                    >
                      {isAuthenticating ? (authMode === "signin" ? "Signing in..." : "Creating...") : "Continue"}
                    </Button>

                    <Button
                      onClick={onContinueGuest}
                      style={{
                        flex: 1,
                        ...(authMode === "signup" ? authTabActiveStyle : authTabIdleStyle),
                      }}
                    >
                      Use app as guest
                    </Button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={sendPasswordReset}
                      disabled={!email || isBusy}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        margin: 0,
                        color: "#111827",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: !email || isBusy ? "not-allowed" : "pointer",
                        opacity: !email || isBusy ? 0.45 : 0.78,
                      }}
                    >
                      Forgot password
                    </button>
                    <button
                      type="button"
                      onClick={resendVerificationEmail}
                      disabled={!email || isBusy}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        margin: 0,
                        color: "#111827",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: !email || isBusy ? "not-allowed" : "pointer",
                        opacity: !email || isBusy ? 0.45 : 0.78,
                      }}
                    >
                      Resend verification email
                    </button>
                  </div>
                </>
              )}

              {!isConfigured && (
                <Button onClick={onContinueGuest} style={{ width: "100%", opacity: 0.9 }}>
                  Use app as guest
                </Button>
              )}
            </>
          )}

          {error ? (
            <div
              style={{
                borderRadius: 12,
                padding: "9px 10px",
                background: "linear-gradient(180deg, rgba(254,232,232,0.9) 0%, rgba(251,215,215,0.86) 100%)",
                border: "1px solid rgba(226,94,94,0.3)",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
