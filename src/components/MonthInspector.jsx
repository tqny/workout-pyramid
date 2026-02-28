import React from "react";
import { formatAuditTimestamp } from "../app/date-utils";
import { Button, Pill } from "./ui";

export function MonthInspector({
  todayISO,
  selectedISO,
  selectedEntry,
  selectedStatus,
  isSelectedToday,
  isPastPlannedTime,
  overduePlannedTimeLabel,
  overdueDurationLabel,
  todayStatus,
  onOpenCommitPlanner,
  onMarkTodayCompleted,
  onMarkTodaySkipped,
  onEditSelectedDay,
}) {
  const selectedStamp = selectedISO ? new Date(selectedISO + "T00:00:00").getTime() : null;
  const todayStamp = new Date(todayISO + "T00:00:00").getTime();
  const isFutureSelected = selectedStamp != null && selectedStamp > todayStamp;
  const isPastSelected = selectedStamp != null && selectedStamp < todayStamp;
  const emptyPushLabel = isSelectedToday ? "Pick your move" : isFutureSelected ? "Don't flake" : "Be honest";
  const statusChipLabel =
    selectedStatus === "completed"
      ? "Got it done"
      : selectedStatus === "planned"
        ? "Locked in"
        : selectedStatus === "skipped"
          ? "Benched yourself"
          : emptyPushLabel;
  const statusChipTone =
    selectedStatus === "completed"
      ? {
          color: "#2f5f3d",
          background: "linear-gradient(180deg, rgba(236,248,239,0.96) 0%, rgba(219,240,225,0.9) 100%)",
          border: "1px solid rgba(127,183,142,0.38)",
        }
      : selectedStatus === "planned"
        ? {
            color: "#6f582c",
            background: "linear-gradient(180deg, rgba(252,246,229,0.95) 0%, rgba(244,231,195,0.88) 100%)",
            border: "1px solid rgba(191,158,95,0.34)",
          }
        : selectedStatus === "skipped"
          ? {
              color: "#6f463f",
              background: "linear-gradient(180deg, rgba(250,238,233,0.96) 0%, rgba(241,214,206,0.88) 100%)",
              border: "1px solid rgba(186,134,123,0.34)",
            }
          : {
              color: "#7a6f62",
              background: "rgba(244,233,214,0.95)",
              border: "1px solid rgba(197,174,139,0.42)",
            };

  return (
    <Pill
      style={{
        borderRadius: 18,
        padding: 14,
        background: "linear-gradient(180deg, rgba(252,244,232,0.96) 0%, rgba(246,235,218,0.94) 100%)",
        boxShadow: "0 8px 20px rgba(17,24,39,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.3, opacity: 0.7 }}>SELECTED DAY</div>
        <div
          style={{
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 500,
            lineHeight: 1,
            ...statusChipTone,
          }}
        >
          {statusChipLabel}
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
        {selectedISO
          ? new Date(selectedISO + "T00:00:00").toLocaleDateString(undefined, { weekday: "long" })
          : "No day selected"}
      </div>

      <div style={{ marginTop: 4, fontSize: 13, opacity: 0.76 }}>
        {selectedISO
          ? new Date(selectedISO + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric" })
          : ""}
        {isSelectedToday ? " • Today" : ""}
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>
          {selectedStatus === "completed" && "Workout complete"}
          {selectedStatus === "planned" && "Workout planned"}
          {selectedStatus === "skipped" && "Recovery day"}
          {selectedStatus === "empty" && emptyPushLabel}
        </div>

        <div style={{ fontSize: 13, opacity: 0.76, lineHeight: 1.35 }}>
          {selectedEntry?.time ? `Start: ${selectedEntry.time}` : "Start time not set"}
          {selectedEntry?.time && selectedEntry?.focus ? " • " : ""}
          {selectedEntry?.focus ? `${selectedEntry.focus}` : ""}
          {!selectedEntry?.time && !selectedEntry?.focus && selectedStatus === "empty"
            ? isSelectedToday
              ? " When?"
              : isFutureSelected
                ? " When?"
                : isPastSelected
                  ? " Log."
                  : " Use Edit day to lock in your plan."
            : ""}
        </div>

        {(selectedEntry?.plannedAt || selectedEntry?.completedAt) && (
          <div style={{ fontSize: 12, opacity: 0.64, lineHeight: 1.35, display: "grid", gap: 2 }}>
            {selectedEntry?.plannedAt && <div>Committed: {formatAuditTimestamp(selectedEntry.plannedAt)}</div>}
            {selectedEntry?.completedAt && <div>Completed at: {formatAuditTimestamp(selectedEntry.completedAt)}</div>}
          </div>
        )}

        {isSelectedToday && isPastPlannedTime && (
          <div style={{ fontSize: 12, fontWeight: 500, color: "#7a6f62", opacity: 0.85 }}>
            Planned for {overduePlannedTimeLabel}
            {overdueDurationLabel ? ` (${overdueDurationLabel})` : ""}.
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {isSelectedToday ? (
          <>
            {todayStatus === "empty" && <Button onClick={onOpenCommitPlanner}>Plan today</Button>}
            {todayStatus === "planned" && (
              <>
                <Button
                  onClick={onMarkTodayCompleted}
                  style={{
                    background: "rgba(187,247,208,0.65)",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }}
                >
                  Mark done
                </Button>
                <Button onClick={onMarkTodaySkipped}>Skip today</Button>
              </>
            )}
            {(todayStatus === "completed" || todayStatus === "skipped") && (
              <Button onClick={onOpenCommitPlanner}>Set new plan</Button>
            )}
            <Button onClick={onEditSelectedDay} style={{ opacity: 0.9 }}>
              Edit day
            </Button>
          </>
        ) : (
          <Button onClick={onEditSelectedDay} style={{ minWidth: 120 }}>
            Edit day
          </Button>
        )}
      </div>
    </Pill>
  );
}
