import React from "react";
import { THEME } from "../app/theme";
import { BrandMark, Button, Pill } from "./ui";

export function HeaderCard({
  view,
  weekRangeLabel,
  monthLabel,
  weekCompletedCount,
  remaining,
  streaks,
  dashboardPrompt,
  onToggleView,
}) {
  const promptStyleByTone = {
    info: {
      background: "rgba(219,234,254,0.55)",
      border: "1px solid rgba(37,99,235,0.18)",
      color: "#0f172a",
    },
    warning: {
      background: "rgba(254,243,199,0.70)",
      border: "1px solid rgba(202,138,4,0.2)",
      color: "#111827",
    },
    positive: {
      background: "rgba(187,247,208,0.55)",
      border: "1px solid rgba(16,185,129,0.2)",
      color: "#0f172a",
    },
  };
  const promptStyle = promptStyleByTone[dashboardPrompt?.tone] || promptStyleByTone.info;

  return (
    <div
      style={{
        borderRadius: 22,
        border: `1px solid ${THEME.line}`,
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(8px)",
        padding: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
        boxShadow: THEME.shadow,
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 12,
          alignItems: "stretch",
        }}
      >
        <BrandMark view={view} weekRangeLabel={weekRangeLabel} monthLabel={monthLabel} />

        <div style={{ display: "grid", gap: 10, alignContent: "start", minWidth: 0 }}>
          <Pill style={{ padding: "13px 14px", borderRadius: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 10 }}>
              <div style={{ fontWeight: 900 }}>Completed: {weekCompletedCount}/4</div>
              <div style={{ opacity: 0.7 }}>Remaining: {remaining}</div>
            </div>
            <div
              style={{
                marginTop: 8,
                height: 10,
                borderRadius: 999,
                background: "#edf1f7",
                border: "1px solid #e6e9ef",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (weekCompletedCount / 4) * 100)}%`,
                  background: "#0b1220",
                  borderRadius: 999,
                  transition: "width 180ms ease",
                }}
              />
            </div>
          </Pill>

          <Pill
            style={{
              minWidth: 0,
              padding: "12px 13px",
              borderRadius: 16,
              ...promptStyle,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.35 }}>
              {dashboardPrompt?.text}
            </div>
          </Pill>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            <Pill style={{ minWidth: 0, padding: "13px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 10 }}>
                <div style={{ fontWeight: 900 }}>🔥 Streak: {streaks.current}</div>
                <div style={{ opacity: 0.7 }}>Best: {streaks.best}</div>
              </div>
            </Pill>

            <Button
              onClick={onToggleView}
              style={{
                width: "100%",
                textAlign: "center",
                padding: "13px 14px",
                borderRadius: 16,
              }}
            >
              {view === "week" ? "Month" : "Week"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
