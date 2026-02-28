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
  const emptyPushLabel = dayStamp === todayStamp ? "Pick your move" : isFutureDay ? "Don't flake" : "Be honest";
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
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,158,11,0.3), ${restingShadow}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = restingShadow;
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: compact ? 11 : 12, fontWeight: 800 }}>{dayNum}</div>
        {isToday && (
          <div
            style={{
              padding: compact ? "2px 5px" : "2px 8px",
              borderRadius: 999,
              background: "rgba(251,191,36,0.3)",
              fontSize: compact ? 10 : 11,
              fontWeight: 700,
            }}
          >
            {compact ? "T" : "Today"}
          </div>
        )}
      </div>

      {!compact && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
          {status === "completed"
            ? "Got it done"
            : status === "planned"
              ? "Locked in"
              : status === "skipped"
                ? "Benched yourself"
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
                ? "linear-gradient(90deg, rgba(131,183,142,0.95) 0%, rgba(174,212,183,0.9) 100%)"
                : status === "planned"
                  ? "linear-gradient(90deg, rgba(196,158,92,0.94) 0%, rgba(231,210,151,0.9) 100%)"
                  : "linear-gradient(90deg, rgba(194,126,117,0.92) 0%, rgba(223,177,168,0.88) 100%)",
          }}
        />
      )}
    </button>
  );
}
