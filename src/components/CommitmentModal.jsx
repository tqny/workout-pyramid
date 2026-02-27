import React from "react";
import { Button, ModalShell } from "./ui";

export function CommitmentModal({
  open,
  onClose,
  step,
  commitTime,
  onChangeCommitTime,
  onYes,
  onNo,
  onBack,
  onSave,
}) {
  return (
    <ModalShell open={open} onClose={onClose} noCloseOnBackdrop={step === "ask"}>
      <div style={{ padding: 24 }}>
        {step === "ask" ? (
          <>
            <div style={{ fontSize: 22, fontWeight: 950, textAlign: "center", marginBottom: 8 }}>
              Training today?
            </div>
            <div style={{ fontSize: 14, opacity: 0.7, textAlign: "center", marginBottom: 24 }}>
              {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <div style={{ fontSize: 13, opacity: 0.66, textAlign: "center", marginTop: -16, marginBottom: 20 }}>
              A quick commitment makes follow-through easier.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Button
                onClick={onYes}
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  fontSize: 16,
                  background: "rgba(187, 247, 208, 0.65)",
                  border: "1px solid rgba(16,185,129,0.35)",
                }}
              >
                Yes, I am
              </Button>
              <Button
                onClick={onNo}
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  fontSize: 16,
                  background: "rgba(254, 202, 202, 0.60)",
                  border: "1px solid rgba(239,68,68,0.35)",
                }}
              >
                Rest day
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 22, fontWeight: 950, textAlign: "center", marginBottom: 8 }}>Pick your start time</div>
            <div style={{ fontSize: 14, opacity: 0.7, textAlign: "center", marginBottom: 24 }}>
              Choose a realistic time you can keep.
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <input
                type="time"
                value={commitTime}
                onChange={(e) => onChangeCommitTime(e.target.value)}
                aria-label="Workout start time"
                style={{
                  flex: 1,
                  borderRadius: 14,
                  border: "1px solid #e6e9ef",
                  padding: "14px 16px",
                  fontSize: 18,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ fontSize: 12, opacity: 0.66, textAlign: "center", marginBottom: 12 }}>
              You can edit this later.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Button onClick={onBack} style={{ flex: 1, opacity: 0.7 }}>
                Back
              </Button>
              <Button
                onClick={onSave}
                disabled={!commitTime}
                style={{
                  flex: 2,
                  padding: "14px 20px",
                  fontSize: 16,
                  background: commitTime ? "rgba(187, 247, 208, 0.65)" : "#f3f6fb",
                  border: commitTime ? "1px solid rgba(16,185,129,0.35)" : "1px solid #e6e9ef",
                  opacity: commitTime ? 1 : 0.5,
                }}
              >
                Commit time
              </Button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
