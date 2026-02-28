import React from "react";
import { Button, ModalShell } from "./ui";

export function InstallAppModal({
  open,
  onClose,
  isIOS,
  isStandalone,
  canNativeInstallPrompt,
  onPromptInstall,
}) {
  return (
    <ModalShell open={open} onClose={onClose} ariaLabel="Install app">
      <div style={{ padding: 18, borderBottom: "1px solid #e6e9ef", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Install app</div>
          <div style={{ fontSize: 12, opacity: 0.68, marginTop: 2 }}>
            Add Workout Pyramid to your home screen for one-tap launch.
          </div>
        </div>
        <button
          type="button"
          aria-label="Close install app"
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

      <div style={{ padding: 18, display: "grid", gap: 12 }}>
        {isStandalone ? (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              background: "rgba(187,247,208,0.55)",
              border: "1px solid rgba(16,185,129,0.2)",
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            Installed. Launch from your home screen anytime.
          </div>
        ) : null}

        {!isStandalone && canNativeInstallPrompt ? (
          <>
            <div style={{ fontSize: 13, lineHeight: 1.45 }}>
              Your browser supports direct install. Tap below and confirm.
            </div>
            <Button onClick={onPromptInstall}>Install now</Button>
          </>
        ) : null}

        {!isStandalone && !canNativeInstallPrompt && isIOS ? (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              background: "rgba(219,234,254,0.55)",
              border: "1px solid rgba(37,99,235,0.18)",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>iPhone steps</div>
            <div>1. Open this app in Safari.</div>
            <div>2. Tap Share (square with up arrow).</div>
            <div>3. Tap Add to Home Screen.</div>
          </div>
        ) : null}

        {!isStandalone && !canNativeInstallPrompt && !isIOS ? (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 12px",
              background: "rgba(254,243,199,0.7)",
              border: "1px solid rgba(202,138,4,0.2)",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            Use your browser menu and choose Install app or Add to Home screen.
          </div>
        ) : null}

        <Button onClick={onClose} style={{ opacity: 0.85 }}>
          Close
        </Button>
      </div>
    </ModalShell>
  );
}
