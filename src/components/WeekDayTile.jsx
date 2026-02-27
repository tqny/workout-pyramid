import React from "react";
import { toISODate } from "../app/date-utils";
import { THEME, toneStyle } from "../app/theme";
import { statusFromEntry, statusStyle } from "../app/store-utils";

export function WeekDayTile({
  dateObj,
  entry,
  todayISO,
  isPhone,
  onOpenEditor,
  onMarkTodayCompleted,
  onMarkTodaySkipped,
}) {
  const iso = toISODate(dateObj);
  const resolvedEntry = entry ?? null;
  const status = statusFromEntry(resolvedEntry);
  const isToday = iso === todayISO;
  const isSunday = dateObj.getDay() === 0;
  const showTodayQuickActions = isToday && status === "planned";
  const compactWeekTile = isPhone;
  const dayStamp = new Date(iso + "T00:00:00").getTime();
  const todayStamp = new Date(todayISO + "T00:00:00").getTime();
  const isFutureDay = dayStamp > todayStamp;
  const emptyPushLabel = isToday ? "Bar's loaded" : isFutureDay ? "No excuses, champ" : "Own the log";
  const emptyDetailLabel = isToday
    ? "Log the reps."
    : isFutureDay
      ? "Claim your time slot."
      : "Record what happened.";

  function stopTileOpen(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const dow = dateObj.toLocaleDateString(undefined, { weekday: "short" });
  const md = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const ariaLabel = `${dow} ${md}, ${status}`;

  function shouldReduceMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => onOpenEditor(iso)}
      style={{
        boxSizing: "border-box",
        ...statusStyle(status),
        borderRadius: 18,
        padding: compactWeekTile ? 10 : 14,
        position: "relative",
        textAlign: "left",
        aspectRatio: "1 / 1",
        minHeight: compactWeekTile ? 96 : 124,
        maxHeight: compactWeekTile ? 162 : 200,
        cursor: "pointer",
        width: "100%",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        boxShadow: isToday
          ? "0 0 0 2px rgba(34,211,238,0.45), 0 14px 28px rgba(0,0,0,0.32)"
          : "0 12px 24px rgba(0,0,0,0.28)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!shouldReduceMotion()) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
      onFocus={(e) => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        e.currentTarget.style.boxShadow = `0 0 0 3px ${THEME.focusRing}, ${isToday
          ? "0 0 0 2px rgba(34,211,238,0.45), 0 14px 28px rgba(0,0,0,0.32)"
          : "0 12px 24px rgba(0,0,0,0.28)"
          }`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = isToday
          ? "0 0 0 2px rgba(34,211,238,0.45), 0 14px 28px rgba(0,0,0,0.32)"
          : "0 12px 24px rgba(0,0,0,0.28)";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontSize: compactWeekTile ? 11 : 12, opacity: 0.72, fontWeight: 800, letterSpacing: 0.2 }}>
            {dow}
          </div>
          <div style={{ fontSize: compactWeekTile ? 12 : 13, fontWeight: 900 }}>{md}</div>
        </div>

        <div
          style={{
            marginTop: compactWeekTile ? 8 : 10,
            fontSize: compactWeekTile ? 13 : 15,
            fontWeight: 950,
            lineHeight: 1.15,
          }}
        >
          {status === "completed" && "Crushed it"}
          {status === "planned" && "Locked in"}
          {status === "skipped" && "Benched"}
          {status === "empty" && emptyPushLabel}
        </div>
      </div>

      <div style={{ marginTop: 8, display: "grid", gap: showTodayQuickActions ? 6 : 0 }}>
        {showTodayQuickActions && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              paddingRight: compactWeekTile ? 50 : 58,
            }}
          >
            <button
              type="button"
              aria-label="Mark today completed"
              onMouseDown={stopTileOpen}
              onClick={(e) => {
                stopTileOpen(e);
                onMarkTodayCompleted();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: compactWeekTile ? "3px 7px" : "4px 8px",
                borderRadius: 999,
                ...toneStyle("positive"),
                fontSize: compactWeekTile ? 9 : 10,
                fontWeight: 900,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME.focusRing}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Mark done
            </button>
            <button
              type="button"
              aria-label="Mark today skipped"
              onMouseDown={stopTileOpen}
              onClick={(e) => {
                stopTileOpen(e);
                onMarkTodaySkipped();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: compactWeekTile ? "3px 7px" : "4px 8px",
                borderRadius: 999,
                ...toneStyle("neutral"),
                fontSize: compactWeekTile ? 9 : 10,
                fontWeight: 900,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME.focusRing}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Skip today
            </button>
          </div>
        )}

        <div
          style={{
            fontSize: compactWeekTile ? 11 : 12,
            opacity: 0.76,
            lineHeight: 1.3,
            paddingRight: isToday ? (compactWeekTile ? 50 : 58) : 0,
          }}
        >
          {resolvedEntry?.time ? `${resolvedEntry.time}` : ""}
          {resolvedEntry?.time && resolvedEntry?.focus ? " • " : ""}
          {resolvedEntry?.focus ? `${resolvedEntry.focus}` : ""}
          {!resolvedEntry?.time && !resolvedEntry?.focus ? emptyDetailLabel : ""}
        </div>
      </div>

      {isSunday && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            fontSize: compactWeekTile ? 26 : 34,
            color: "rgba(233,248,240,0.4)",
            fontWeight: 800,
          }}
        >
          ✝
        </div>
      )}

      {isToday && (
        <div
          style={{
            position: "absolute",
            right: compactWeekTile ? 8 : 12,
            bottom: compactWeekTile ? 8 : 12,
            padding: compactWeekTile ? "2px 6px" : "3px 8px",
            borderRadius: 999,
            background: "rgba(34,211,238,0.22)",
            color: "#d7fbff",
            fontSize: compactWeekTile ? 10 : 11,
            fontWeight: 900,
          }}
        >
          TODAY
        </div>
      )}
    </button>
  );
}
