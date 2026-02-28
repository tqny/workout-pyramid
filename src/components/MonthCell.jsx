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
  const statusVisual = statusStyle(status);
  const headlineColor = "rgba(12, 14, 18, 0.98)";
  const statusHeadlineLabel =
    status === "completed"
      ? "Got it done"
      : status === "planned"
        ? "Locked in"
        : status === "skipped"
          ? "Benched yourself"
          : emptyPushLabel;
  const statusHeadlineGradient =
    status === "completed"
      ? "linear-gradient(180deg, rgba(43,87,56,0.96) 0%, rgba(23,54,35,0.98) 100%)"
      : status === "planned"
        ? "linear-gradient(180deg, rgba(130,102,56,0.95) 0%, rgba(86,66,34,0.98) 100%)"
        : status === "skipped"
          ? "linear-gradient(180deg, rgba(129,82,73,0.95) 0%, rgba(80,50,44,0.98) 100%)"
          : "linear-gradient(180deg, rgba(79,73,61,0.95) 0%, rgba(39,35,29,0.98) 100%)";
  const statusHeadlineStyle = {
    color: headlineColor,
    backgroundImage: statusHeadlineGradient,
    backgroundSize: "100% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  const todayMarkerStyle = {
    position: "absolute",
    top: compact ? 4 : 5,
    right: compact ? 5 : 7,
    fontSize: compact ? 11 : 13,
    lineHeight: 1,
    opacity: 0.78,
    pointerEvents: "none",
  };
  const restingShadow = isToday
    ? "0 0 0 1.5px rgba(17,24,39,0.28), 0 6px 14px rgba(17,24,39,0.06)"
    : "0 4px 10px rgba(17,24,39,0.04)";
  const selectedShadow = isToday
    ? "0 0 0 1px rgba(116,94,64,0.32), 0 10px 20px rgba(63,44,21,0.14)"
    : "0 0 0 1px rgba(116,94,64,0.24), 0 8px 16px rgba(63,44,21,0.12)";
  const baseTransform = isSelected ? "translateY(-1px)" : "translateY(0px)";
  const selectedOverlay = "linear-gradient(180deg, rgba(255,249,240,0.26) 0%, rgba(247,236,220,0.22) 100%)";

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
        ...statusVisual,
        background: isSelected ? `${selectedOverlay}, ${statusVisual.background}` : statusVisual.background,
        borderRadius: 14,
        padding: compact ? 6 : 9,
        position: "relative",
        textAlign: "left",
        aspectRatio: compact ? "1 / 1" : "1 / 0.9",
        minHeight: compact ? 44 : 86,
        cursor: "pointer",
        width: "100%",
        opacity: inMonth ? 1 : 0.55,
        boxShadow: isSelected ? selectedShadow : restingShadow,
        transform: baseTransform,
        transition: "transform 120ms ease, box-shadow 120ms ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (!shouldReduceMotion()) e.currentTarget.style.transform = isSelected ? "translateY(-2px)" : "translateY(-1px)";
      }}
      onMouseLeave={(e) => (e.currentTarget.style.transform = baseTransform)}
      onFocus={(e) => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        const baseShadow = isSelected ? selectedShadow : restingShadow;
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(245,158,11,0.26), ${baseShadow}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = baseTransform;
        e.currentTarget.style.boxShadow = isSelected ? selectedShadow : restingShadow;
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div
          style={{
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: headlineColor,
          }}
        >
          {dayNum}
        </div>
      </div>
      {isToday && <div style={todayMarkerStyle} aria-label="Today">💪</div>}

      {!compact && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 8px 12px",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              ...statusHeadlineStyle,
              fontSize: 12,
              opacity: 0.84,
              letterSpacing: 0.05,
              fontWeight: 500,
            }}
          >
            {statusHeadlineLabel}
          </span>
        </div>
      )}

      {compact && status !== "empty" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 6,
            right: 6,
            bottom: 6,
            height: 4,
            borderRadius: 999,
            background:
              status === "completed"
                ? "linear-gradient(90deg, rgba(131,183,142,0.95) 0%, rgba(174,212,183,0.9) 100%)"
                : status === "planned"
                  ? "linear-gradient(90deg, rgba(234,214,165,0.90) 0%, rgba(244,231,195,0.88) 100%)"
                  : "linear-gradient(90deg, rgba(214,154,141,0.90) 0%, rgba(236,199,190,0.86) 100%)",
          }}
        />
      )}
    </button>
  );
}
