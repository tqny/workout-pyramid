import React from "react";
import { toneStyle } from "../app/theme";
import { Button, Pill } from "./ui";

export function ProductActionsBar({
  cloudSyncLabel,
  cloudSyncTone = "info",
  onOpenCloudSync,
  installLabel = "Install app",
  installTone = "info",
  onOpenInstall,
  disableInstall = false,
  showAdminMetricsAction = false,
  onOpenAdminMetrics,
  onOpenReview,
  notice,
}) {
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
            ...toneStyle(cloudSyncTone || "info"),
          }}
        >
          {cloudSyncLabel}
        </Button>
        <Button
          onClick={onOpenInstall}
          disabled={disableInstall}
          style={{
            flex: "1 1 160px",
            ...toneStyle(installTone || "info"),
          }}
        >
          {installLabel}
        </Button>
        {showAdminMetricsAction ? (
          <Button
            onClick={onOpenAdminMetrics}
            style={{
              flex: "1 1 160px",
              ...toneStyle("warning"),
            }}
          >
            Admin metrics
          </Button>
        ) : null}
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
            ...(toneStyle(notice.tone || "info")),
          }}
        >
          {notice.text}
        </div>
      )}
    </Pill>
  );
}
