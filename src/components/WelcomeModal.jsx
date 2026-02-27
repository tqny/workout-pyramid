import React from "react";
import { Button, ModalShell } from "./ui";

export function WelcomeModal({ open, onClose, onOpenCloudSync, onOpenInstall }) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div
        style={{
          padding: 18,
          borderBottom: "1px solid #e6e9ef",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "start",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Welcome to Workout Pyramid</div>
          <div style={{ fontSize: 12, opacity: 0.68, marginTop: 2 }}>
            Quick setup so this feels practical every day.
          </div>
        </div>
        <button
          type="button"
          aria-label="Close onboarding"
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
          <div style={{ fontWeight: 900, marginBottom: 6 }}>How this works</div>
          <div>1. Plan today.</div>
          <div>2. Mark done or skipped by day-end.</div>
          <div>3. Keep the week honest and repeat.</div>
        </div>

        <div
          style={{
            borderRadius: 12,
            padding: "10px 12px",
            background: "rgba(240,253,250,0.8)",
            border: "1px solid rgba(16,185,129,0.18)",
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Practical setup</div>
          <div>Install to your home screen for one-tap access.</div>
          <div>Use your phone Reminders app at 7:00 AM with this app URL in the note.</div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <Button onClick={onOpenCloudSync}>Set up cloud sign-in</Button>
          <Button onClick={onOpenInstall}>Install guidance</Button>
          <Button onClick={onClose} style={{ opacity: 0.9 }}>
            Start using app
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
