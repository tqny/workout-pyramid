import React from "react";
import { toISODate } from "../app/date-utils";
import { THEME } from "../app/theme";
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
  const emptyPushLabel = dayStamp === todayStamp ? "Bar's loaded" : isFutureDay ? "No excuses, champ" : "Own the log";
  const ariaLabel = `${dateObj.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}, ${status}`;
  const restingShadow = isToday
    ? "0 0 0 1.5px rgba(34,211,238,0.45), 0 6px 14px rgba(0,0,0,0.3)"
    : "0 4px 10px rgba(0,0,0,0.24)";

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
        outline: isSelected ? "2px solid rgba(34,211,238,0.6)" : "none",
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
        e.currentTarget.style.boxShadow = `0 0 0 3px ${THEME.focusRing}, ${restingShadow}`;
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
              background: "rgba(34,211,238,0.22)",
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
            ? "Crushed it"
            : status === "planned"
              ? "Locked in"
              : status === "skipped"
                ? "Benched"
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
                ? "rgba(74,222,128,0.95)"
                : status === "planned"
                  ? "rgba(250,204,21,0.95)"
                  : "rgba(248,113,113,0.9)",
          }}
        />
      )}
    </button>
  );
}
