import React from "react";
import { toISODate } from "../app/date-utils";
import { statusFromEntry, statusStyle } from "../app/store-utils";

export function MonthCell({
  dateObj,
  inMonth,
  entry,
  todayISO,
  selectedISO,
  isCompactMonthGrid,
  onSelect,
}) {
  const iso = toISODate(dateObj);
  const resolvedEntry = entry ?? null;
  const status = statusFromEntry(resolvedEntry);
  const isToday = iso === todayISO;
  const isSelected = iso === selectedISO;
  const compact = isCompactMonthGrid;
  const dayNum = dateObj.getDate();
  const dayStamp = new Date(iso + "T00:00:00").getTime();
  const todayStamp = new Date(todayISO + "T00:00:00").getTime();
  const isFutureDay = dayStamp > todayStamp;
  const emptyPushLabel = dayStamp === todayStamp ? "Clock's ticking" : isFutureDay ? "Don't flake" : "Be honest";
  const ariaLabel = `${dateObj.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}, ${status}`;
  const restingShadow = isToday
    ? "0 0 0 1.5px rgba(17,24,39,0.28), 0 6px 14px rgba(17,24,39,0.06)"
    : "0 4px 10px rgba(17,24,39,0.04)";

  function shouldReduceMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => onSelect(iso)}
      style={{
        boxSizing: "border-box",
        ...statusStyle(status),
        borderRadius: 14,
        padding: compact ? 6 : 9,
        position: "relative",
        textAlign: "left",
        aspectRatio: compact ? "1 / 1" : "1 / 0.9",
        minHeight: compact ? 44 : 86,
        cursor: "pointer",
        width: "100%",
        opacity: inMonth ? 1 : 0.55,
        boxShadow: restingShadow,
        outline: isSelected ? "2px solid rgba(17,24,39,0.48)" : "none",
        outlineOffset: 0,
        transition: "transform 120ms ease, box-shadow 120ms ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!shouldReduceMotion()) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
      onFocus={(e) => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(59,130,246,0.28), ${restingShadow}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = restingShadow;
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: compact ? 11 : 12, fontWeight: 950 }}>{dayNum}</div>
        {isToday && (
          <div
            style={{
              padding: compact ? "2px 5px" : "2px 8px",
              borderRadius: 999,
              background: "rgba(147,197,253,0.55)",
              fontSize: compact ? 10 : 11,
              fontWeight: 900,
            }}
          >
            {compact ? "T" : "Today"}
          </div>
        )}
      </div>

      {!compact && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
          {status === "completed"
            ? "Completed"
            : status === "planned"
              ? "Planned"
              : status === "skipped"
                ? "Skipped"
                : emptyPushLabel}
        </div>
      )}

      {compact && status !== "empty" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 6,
            right: isToday ? 28 : 6,
            bottom: 6,
            height: 4,
            borderRadius: 999,
            background:
              status === "completed"
                ? "rgba(16,185,129,0.85)"
                : status === "planned"
                  ? "rgba(234,179,8,0.85)"
                  : "rgba(239,68,68,0.8)",
          }}
        />
      )}
    </button>
  );
}
