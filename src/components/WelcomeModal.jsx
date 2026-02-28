import React from "react";
import { Button, ModalShell } from "./ui";

export function WelcomeModal({ open, onClose }) {
  return (
    <ModalShell open={open} onClose={onClose} ariaLabel="Welcome">
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
          <div style={{ fontSize: 18, fontWeight: 700 }}>Welcome to Workout Pyramid</div>
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
            fontWeight: 600,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: 18, display: "grid", gap: 12 }}>
        <div
          style={{
            borderRadius: 12,
            padding: "11px 12px",
            background:
              "linear-gradient(180deg, rgba(246,251,255,0.92) 0%, rgba(232,244,252,0.86) 100%)",
            border: "1px solid rgba(164,193,217,0.34)",
            boxShadow: "0 8px 16px rgba(36, 60, 84, 0.10)",
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>How this works</div>
          <div>1. Plan today.</div>
          <div>2. Mark done or skipped by day-end.</div>
          <div>3. Keep the week honest and repeat.</div>
        </div>

        <div
          style={{
            borderRadius: 12,
            padding: "11px 12px",
            background:
              "linear-gradient(180deg, rgba(248,255,252,0.92) 0%, rgba(232,247,240,0.86) 100%)",
            border: "1px solid rgba(114,176,137,0.30)",
            boxShadow: "0 8px 16px rgba(36, 84, 53, 0.09)",
            fontSize: 13,
            lineHeight: 1.4,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Practical setup</div>
          <div>1. Install to your home screen for one-tap access.</div>
          <div>2. Use your phone Reminders app to commit first thing in the AM.</div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <Button onClick={onClose} style={{ opacity: 0.9 }}>
            Continue
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
