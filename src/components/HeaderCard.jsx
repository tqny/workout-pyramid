import React from "react";
import { THEME, toneStyle } from "../app/theme";
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
  const promptStyle = toneStyle(dashboardPrompt?.tone || "info");

  return (
    <div
      style={{
        borderRadius: 22,
        border: `1px solid ${THEME.line}`,
        background: THEME.panel,
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
                background: "rgba(11, 26, 23, 0.92)",
                border: `1px solid ${THEME.line}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (weekCompletedCount / 4) * 100)}%`,
                  background:
                    "linear-gradient(90deg, rgba(34,211,238,0.95) 0%, rgba(74,222,128,0.95) 100%)",
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
