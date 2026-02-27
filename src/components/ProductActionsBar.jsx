import React from "react";
import { Button, Pill } from "./ui";

export function ProductActionsBar({
  cloudSyncLabel,
  cloudSyncTone = "info",
  onOpenCloudSync,
  installLabel = "Install app",
  installTone = "info",
  onOpenInstall,
  disableInstall = false,
  onOpenReview,
  notice,
}) {
  const noticeStyleByTone = {
    positive: {
      background: "rgba(187,247,208,0.55)",
      border: "1px solid rgba(16,185,129,0.2)",
      color: "#0f172a",
    },
    warning: {
      background: "rgba(254,243,199,0.7)",
      border: "1px solid rgba(202,138,4,0.2)",
      color: "#111827",
    },
    info: {
      background: "rgba(219,234,254,0.55)",
      border: "1px solid rgba(37,99,235,0.18)",
      color: "#0f172a",
    },
  };

  return (
    <Pill style={{ marginTop: 12, borderRadius: 18, padding: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Button onClick={onOpenReview} style={{ flex: "1 1 160px" }}>
          Weekly review
        </Button>
        <Button
          onClick={onOpenCloudSync}
          style={{
            flex: "1 1 160px",
            background:
              cloudSyncTone === "positive"
                ? "rgba(187,247,208,0.65)"
                : cloudSyncTone === "warning"
                  ? "rgba(254,243,199,0.70)"
                  : undefined,
            border:
              cloudSyncTone === "positive"
                ? "1px solid rgba(16,185,129,0.25)"
                : cloudSyncTone === "warning"
                  ? "1px solid rgba(202,138,4,0.2)"
                  : undefined,
          }}
        >
          {cloudSyncLabel}
        </Button>
        <Button
          onClick={onOpenInstall}
          disabled={disableInstall}
          style={{
            flex: "1 1 160px",
            background:
              installTone === "positive"
                ? "rgba(187,247,208,0.65)"
                : installTone === "warning"
                  ? "rgba(254,243,199,0.70)"
                  : undefined,
            border:
              installTone === "positive"
                ? "1px solid rgba(16,185,129,0.25)"
                : installTone === "warning"
                  ? "1px solid rgba(202,138,4,0.2)"
                  : undefined,
          }}
        >
          {installLabel}
        </Button>
      </div>

      {notice?.text && (
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            padding: "8px 10px",
            fontSize: 12,
            fontWeight: 800,
            lineHeight: 1.35,
            ...(noticeStyleByTone[notice.tone] || noticeStyleByTone.info),
          }}
        >
          {notice.text}
        </div>
      )}
    </Pill>
  );
}
