import React from "react";
import { Button, ModalShell } from "./ui";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyReviewModal({
  open,
  onClose,
  weekRangeLabel,
  summary,
  templateDays,
  templateTime,
  onTemplateDayToggle,
  onTemplateTimeChange,
  onApplyTemplate,
}) {
  return (
    <ModalShell open={open} onClose={onClose} ariaLabel="Weekly review">
      <div style={{ padding: 18, borderBottom: "1px solid #e6e9ef", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>Weekly review</div>
          <div style={{ fontSize: 12, opacity: 0.68, marginTop: 2 }}>{weekRangeLabel}</div>
        </div>
        <button
          type="button"
          aria-label="Close weekly review"
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

      <div style={{ padding: 18, display: "grid", gap: 14, maxHeight: "75vh", overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          <div style={{ border: "1px solid #e6e9ef", borderRadius: 12, padding: "9px 10px", background: "#fff" }}>
            <div style={{ fontSize: 11, opacity: 0.66, fontWeight: 800 }}>COMPLETED</div>
            <div style={{ fontSize: 20, fontWeight: 950, marginTop: 2 }}>{summary.completed}</div>
          </div>
          <div style={{ border: "1px solid #e6e9ef", borderRadius: 12, padding: "9px 10px", background: "#fff" }}>
            <div style={{ fontSize: 11, opacity: 0.66, fontWeight: 800 }}>PLANNED</div>
            <div style={{ fontSize: 20, fontWeight: 950, marginTop: 2 }}>{summary.planned}</div>
          </div>
          <div style={{ border: "1px solid #e6e9ef", borderRadius: 12, padding: "9px 10px", background: "#fff" }}>
            <div style={{ fontSize: 11, opacity: 0.66, fontWeight: 800 }}>SKIPPED</div>
            <div style={{ fontSize: 20, fontWeight: 950, marginTop: 2 }}>{summary.skipped}</div>
          </div>
          <div style={{ border: "1px solid #e6e9ef", borderRadius: 12, padding: "9px 10px", background: "#fff" }}>
            <div style={{ fontSize: 11, opacity: 0.66, fontWeight: 800 }}>OPEN</div>
            <div style={{ fontSize: 20, fontWeight: 950, marginTop: 2 }}>{summary.open}</div>
          </div>
        </div>

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
          <div style={{ fontWeight: 900 }}>Logged completion rate: {summary.completionRate}%</div>
          <div style={{ marginTop: 3 }}>Rate is based on days you logged as completed or skipped.</div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 8 }}>This week, day by day</div>
          <div style={{ display: "grid", gap: 6 }}>
            {summary.rows.map((row) => (
              <div
                key={row.iso}
                style={{
                  border: "1px solid #e6e9ef",
                  borderRadius: 10,
                  padding: "8px 10px",
                  background: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800 }}>{row.label}</div>
                <div style={{ fontSize: 13, opacity: 0.75, textAlign: "right" }}>
                  {row.statusLabel}
                  {row.time ? ` • ${row.time}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e6e9ef", paddingTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 8 }}>Plan next week template</div>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {DAY_LABELS.map((label, idx) => {
                const active = templateDays.includes(idx);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onTemplateDayToggle(idx)}
                    style={{
                      borderRadius: 999,
                      border: active ? "1px solid rgba(16,185,129,0.35)" : "1px solid #e6e9ef",
                      background: active ? "rgba(187,247,208,0.65)" : "#fff",
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Template start time</div>
              <input
                type="time"
                value={templateTime}
                onChange={(e) => onTemplateTimeChange(e.target.value)}
                aria-label="Template start time"
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
              <Button onClick={onApplyTemplate} disabled={templateDays.length === 0 || !templateTime} style={{ flex: 2 }}>
                Apply next week plan
              </Button>
              <Button onClick={onClose} style={{ flex: 1, opacity: 0.85 }}>
                Close
              </Button>
            </div>
            <div style={{ fontSize: 12, opacity: 0.66 }}>
              Existing entries in next week are preserved.
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
