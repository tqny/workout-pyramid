import React from "react";
import { Button, Pill } from "./ui";

export function ProductActionsBar({
  cloudSyncLabel,
  cloudSyncTone = "info",
  onOpenCloudSync,
  installLabel = "Install app",
  onOpenInstall,
  disableInstall = false,
  onOpenReview,
  notice,
}) {
  const actionRow = [
    {
      key: "review",
      label: "Weekly review",
      onClick: onOpenReview,
      tone: "primary",
      disabled: false,
    },
    {
      key: "cloud",
      label: cloudSyncLabel,
      onClick: onOpenCloudSync,
      tone: cloudSyncTone,
      disabled: false,
    },
    {
      key: "install",
      label: installLabel,
      onClick: onOpenInstall,
      tone: "info",
      disabled: disableInstall,
    },
  ];

  const actionStyleByTone = {
    primary: {
      background: "linear-gradient(180deg, rgba(255,251,244,0.98) 0%, rgba(250,239,221,0.96) 100%)",
      border: "1px solid rgba(176,125,56,0.28)",
      boxShadow: "0 10px 24px rgba(63,44,21,0.12)",
    },
    positive: {
      background: "linear-gradient(180deg, rgba(219,245,226,0.95) 0%, rgba(191,231,202,0.9) 100%)",
      border: "1px solid rgba(22,163,74,0.28)",
      boxShadow: "0 10px 22px rgba(17,24,39,0.10)",
    },
    warning: {
      background: "linear-gradient(180deg, rgba(252,244,217,0.96) 0%, rgba(244,228,179,0.9) 100%)",
      border: "1px solid rgba(202,138,4,0.28)",
      boxShadow: "0 10px 22px rgba(17,24,39,0.10)",
    },
    info: {
      background: "linear-gradient(180deg, rgba(255,250,242,0.98) 0%, rgba(250,240,225,0.95) 100%)",
      border: "1px solid rgba(217,119,6,0.24)",
      boxShadow: "0 8px 18px rgba(63,44,21,0.08)",
    },
  };

  const noticeStyleByTone = {
    positive: {
      background: "rgba(187,247,208,0.64)",
      border: "1px solid rgba(22,163,74,0.24)",
      color: "#0f172a",
    },
    warning: {
      background: "rgba(254,243,199,0.76)",
      border: "1px solid rgba(202,138,4,0.25)",
      color: "#53350f",
    },
    info: {
      background: "rgba(255,246,233,0.9)",
      border: "1px solid rgba(217,119,6,0.22)",
      color: "#3f2d15",
    },
  };

  return (
    <Pill style={{ marginTop: 12, borderRadius: 18, padding: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {actionRow.map((action) => (
          <Button
            key={action.key}
            onClick={action.onClick}
            disabled={action.disabled}
            style={{
              width: "100%",
              minHeight: 44,
              fontWeight: 600,
              letterSpacing: 0.1,
              ...(actionStyleByTone[action.tone] || actionStyleByTone.info),
            }}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {notice?.text && (
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            padding: "8px 10px",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.35,
            ...(noticeStyleByTone[notice.tone] || noticeStyleByTone.info),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span>{notice.text}</span>
            {notice.actionLabel && typeof notice.onAction === "function" ? (
              <button
                type="button"
                onClick={notice.onAction}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(17,24,39,0.18)",
                  background: "rgba(255,255,255,0.84)",
                  color: "#111827",
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: 1,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {notice.actionLabel}
              </button>
            ) : null}
          </div>
        </div>
      )}
    </Pill>
  );
}
