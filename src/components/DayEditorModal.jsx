import React from "react";
import { Button, ModalShell } from "./ui";

export function DayEditorModal({
  open,
  onClose,
  activeISO,
  draftStatus,
  setDraftStatus,
  draftTime,
  setDraftTime,
  draftFocus,
  setDraftFocus,
  onClearEntry,
  onSave,
}) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div style={{ padding: 16, borderBottom: "1px solid #e6e9ef", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 950 }}>
          {activeISO
            ? new Date(activeISO + "T00:00:00").toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
            : ""}
        </div>
        <button
          type="button"
          aria-label="Close day editor"
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

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            onClick={() => setDraftStatus("planned")}
            style={{
              flex: 1,
              background: draftStatus === "planned" ? "rgba(253, 230, 92, 0.42)" : "#fff",
            }}
          >
            Planned
          </Button>
          <Button
            onClick={() => setDraftStatus("completed")}
            style={{
              flex: 1,
              background: draftStatus === "completed" ? "rgba(187,247,208,0.65)" : "#fff",
            }}
          >
            Completed
          </Button>
          <Button
            onClick={() => setDraftStatus("skipped")}
            style={{
              flex: 1,
              background: draftStatus === "skipped" ? "rgba(254,202,202,0.60)" : "#fff",
            }}
          >
            Skipped
          </Button>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Start time</div>
            <input
              type="time"
              value={draftTime}
              onChange={(e) => setDraftTime(e.target.value)}
              aria-label="Workout start time"
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

          <div>
            <div style={{ fontSize: 12, fontWeight: 900, opacity: 0.7, marginBottom: 6 }}>Session focus</div>
            <input
              value={draftFocus}
              onChange={(e) => setDraftFocus(e.target.value)}
              placeholder="e.g., Legs + mobility"
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

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button onClick={onClearEntry} style={{ flex: 1, opacity: 0.85 }}>
              Remove entry
            </Button>

            <Button
              onClick={onSave}
              style={{
                flex: 2,
                border: "1px solid rgba(17,24,39,0.25)",
                boxShadow: "0 10px 22px rgba(17,24,39,0.10)",
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
