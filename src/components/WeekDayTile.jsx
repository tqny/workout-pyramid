import React from "react";
import { toISODate } from "../app/date-utils";
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
  const emptyPushLabel = isToday ? "Pick your move" : isFutureDay ? "Don't flake" : "Be honest";
  const emptyDetailLabel = isToday
    ? "Pick a time. Future-you is watching."
    : isFutureDay
      ? "Pick a time. Future-you is watching."
      : "Log what happened.";

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
        padding: compactWeekTile ? 11 : 14,
        position: "relative",
        textAlign: "left",
        aspectRatio: compactWeekTile ? "auto" : "1 / 1",
        minHeight: compactWeekTile ? 118 : 124,
        maxHeight: compactWeekTile ? undefined : 200,
        cursor: "pointer",
        width: "100%",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        boxShadow: isToday
          ? "0 0 0 2px rgba(17,24,39,0.55), 0 14px 28px rgba(17,24,39,0.10)"
          : "0 12px 24px rgba(17,24,39,0.08)",
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
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,158,11,0.3), ${isToday
          ? "0 0 0 2px rgba(17,24,39,0.55), 0 14px 28px rgba(17,24,39,0.10)"
          : "0 12px 24px rgba(17,24,39,0.08)"
          }`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = isToday
          ? "0 0 0 2px rgba(17,24,39,0.55), 0 14px 28px rgba(17,24,39,0.10)"
          : "0 12px 24px rgba(17,24,39,0.08)";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontSize: compactWeekTile ? 11 : 12, opacity: 0.72, fontWeight: 700, letterSpacing: 0.2 }}>
            {dow}
          </div>
          <div style={{ fontSize: compactWeekTile ? 12 : 13, fontWeight: 700 }}>{md}</div>
        </div>

        <div
          style={{
            marginTop: compactWeekTile ? 8 : 10,
            fontSize: compactWeekTile ? 13 : 15,
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          {status === "completed" && "Got it done"}
          {status === "planned" && "Locked in"}
          {status === "skipped" && "Benched yourself"}
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
                padding: compactWeekTile ? "4px 8px" : "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(16,185,129,0.25)",
                background: "rgba(187,247,208,0.70)",
                color: "#0f172a",
                fontSize: compactWeekTile ? 10 : 10,
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.35)";
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
                padding: compactWeekTile ? "4px 8px" : "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(17,24,39,0.12)",
                background: "rgba(255,255,255,0.88)",
                color: "#111827",
                fontSize: compactWeekTile ? 10 : 10,
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.35)";
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
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: compactWeekTile ? 3 : 2,
            WebkitBoxOrient: "vertical",
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
            color: "rgba(17,24,39,0.45)",
            fontWeight: 700,
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
            background: "rgba(251,191,36,0.3)",
            color: "#5b3f07",
            fontSize: compactWeekTile ? 10 : 11,
            fontWeight: 700,
          }}
        >
          TODAY
        </div>
      )}
    </button>
  );
}
