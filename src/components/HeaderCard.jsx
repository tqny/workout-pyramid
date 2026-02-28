import React, { useState } from "react";
import { THEME } from "../app/theme";
import { BrandMark, Button, Pill } from "./ui";

export function HeaderCard({
  view,
  weekRangeLabel,
  monthLabel,
  weekCompletedCount,
  weeklyGoal,
  remaining,
  streaks,
  onUpdateWeeklyGoal,
  onToggleView,
}) {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(String(weeklyGoal));

  function normalizeGoal(raw) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return weeklyGoal;
    return Math.max(1, Math.min(14, parsed));
  }

  function saveGoal() {
    const nextGoal = normalizeGoal(goalDraft);
    onUpdateWeeklyGoal?.(nextGoal);
    setIsEditingGoal(false);
  }

  function cancelGoalEdit() {
    setGoalDraft(String(weeklyGoal));
    setIsEditingGoal(false);
  }

  const progressPercent = Math.min(100, (weekCompletedCount / Math.max(1, weeklyGoal)) * 100);

  return (
    <div
      style={{
        borderRadius: 22,
        border: `1px solid ${THEME.line}`,
        background: "rgba(255,250,243,0.92)",
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

        <div style={{ display: "grid", gap: 10, alignContent: "start", minWidth: 0, gridTemplateRows: "auto auto" }}>
          {isEditingGoal ? (
            <Pill
              style={{
                padding: "12px 13px",
                borderRadius: 18,
                minHeight: 82,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 600 }}>
                  Completed: {weekCompletedCount}/{weeklyGoal}
                </div>
                <div style={{ opacity: 0.72, fontWeight: 600 }}>Remaining: {remaining}</div>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 10,
                  borderRadius: 999,
                  background: "#efe5d7",
                  border: "1px solid #dfcfb8",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background:
                      "linear-gradient(90deg, rgba(212,174,112,0.92) 0%, rgba(232,204,140,0.9) 56%, rgba(245,224,175,0.85) 100%)",
                    borderRadius: 999,
                    transition: "width 180ms ease",
                  }}
                />
              </div>

              <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.78 }}>Weekly goal</div>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={goalDraft}
                  onChange={(e) => setGoalDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveGoal();
                    if (e.key === "Escape") cancelGoalEdit();
                  }}
                  style={{
                    width: 70,
                    padding: "5px 8px",
                    borderRadius: 10,
                    border: `1px solid ${THEME.line}`,
                    background: "#fffdf9",
                    color: THEME.ink,
                    fontWeight: 600,
                  }}
                />
                <button
                  type="button"
                  onClick={saveGoal}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${THEME.line}`,
                    background: "#fff9ef",
                    color: THEME.ink,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "5px 9px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelGoalEdit}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${THEME.line}`,
                    background: "#fff9ef",
                    color: THEME.ink,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "5px 9px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </Pill>
          ) : (
            <button
              type="button"
              aria-label={`Weekly progress ${weekCompletedCount} of ${weeklyGoal}. Edit weekly goal.`}
              onClick={() => {
                setGoalDraft(String(weeklyGoal));
                setIsEditingGoal(true);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                borderRadius: 18,
                border: `1px solid ${THEME.line}`,
                background: THEME.panel,
                padding: "12px 13px",
                minHeight: 82,
                boxShadow: "0 4px 14px rgba(16, 24, 40, 0.04)",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 600 }}>
                  Completed: {weekCompletedCount}/{weeklyGoal}
                </div>
                <div style={{ opacity: 0.72, fontWeight: 600 }}>Remaining: {remaining}</div>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 10,
                  borderRadius: 999,
                  background: "#efe5d7",
                  border: "1px solid #dfcfb8",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background:
                      "linear-gradient(90deg, rgba(212,174,112,0.92) 0%, rgba(232,204,140,0.9) 56%, rgba(245,224,175,0.85) 100%)",
                    borderRadius: 999,
                    transition: "width 180ms ease",
                  }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.68, fontWeight: 600 }}>Tap to edit weekly goal.</div>
            </button>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            <Pill style={{ minWidth: 0, padding: "13px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 10 }}>
                <div style={{ fontWeight: 600 }}>🔥 Streak: {streaks.current}</div>
                <div style={{ opacity: 0.72, fontWeight: 600 }}>Best: {streaks.best}</div>
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
