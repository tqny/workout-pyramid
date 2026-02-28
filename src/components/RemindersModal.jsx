import React from "react";
import { Button, ModalShell } from "./ui";

export function RemindersModal({
  open,
  onClose,
  settings,
  permission,
  supportsNotifications,
  onToggleEnabled,
  onDailyCheckTime,
}) {
  const permissionLabel =
    permission === "granted"
      ? "granted"
      : permission === "denied"
        ? "blocked"
        : permission === "default"
          ? "not requested"
          : "unsupported";

  return (
    <ModalShell open={open} onClose={onClose} ariaLabel="Reminder settings">
      <div style={{ padding: 18, borderBottom: "1px solid #e6e9ef", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Reminder settings</div>
          <div style={{ fontSize: 12, opacity: 0.68, marginTop: 2 }}>
            Local browser notifications for planned time and end-of-day logging.
          </div>
        </div>
        <button
          type="button"
          aria-label="Close reminder settings"
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
          <div style={{ fontWeight: 900 }}>Browser support: {supportsNotifications ? "available" : "not available"}</div>
          <div style={{ marginTop: 3 }}>Permission: {permissionLabel}</div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Daily unresolved check time</div>
          <input
            type="time"
            value={settings.dailyCheckTime}
            onChange={(e) => onDailyCheckTime(e.target.value)}
            aria-label="Daily unresolved check time"
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
            onClick={() => onToggleEnabled(!settings.enabled)}
            style={{
              flex: 1,
              background: settings.enabled ? "rgba(187,247,208,0.65)" : "#fff",
              border: settings.enabled ? "1px solid rgba(16,185,129,0.25)" : undefined,
            }}
          >
            {settings.enabled ? "Disable reminders" : "Enable reminders"}
          </Button>
          <Button onClick={onClose} style={{ flex: 1, opacity: 0.85 }}>
            Done
          </Button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.66, lineHeight: 1.35 }}>
          Reminder delivery depends on browser notification support and permission. Notifications fire while this app is open in a browser session.
        </div>
      </div>
    </ModalShell>
  );
}
