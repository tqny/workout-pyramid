import React from "react";
import { toISODate } from "../app/date-utils";
import { statusFromEntry, statusStyle } from "../app/store-utils";

export function WeekDayTile({
  dateObj,
  entry,
  todayISO,
  isPhone,
  isTopRow = false,
  onOpenEditor,
  onMarkTodayCompleted,
  onMarkTodaySkipped,
}) {
  const iso = toISODate(dateObj);
  const resolvedEntry = entry ?? null;
  const status = statusFromEntry(resolvedEntry);
  const isToday = iso === todayISO;
  const showTodayQuickActions = isToday && status === "planned";
  const compactWeekTile = isPhone;
  const compactTopRowTile = compactWeekTile && isTopRow;
  const dayStamp = new Date(iso + "T00:00:00").getTime();
  const todayStamp = new Date(todayISO + "T00:00:00").getTime();
  const isFutureDay = dayStamp > todayStamp;
  const emptyPushLabel = isToday ? "Pick your move" : isFutureDay ? "Don't flake" : "Be honest";
  const emptyDetailLabel = isToday || isFutureDay ? "When?" : "Log";
  const headlineColor = "rgba(12, 14, 18, 0.98)";
  const statusHeadlineLabel =
    status === "completed"
      ? compactTopRowTile
        ? "Done"
        : "Got it done"
      : status === "planned"
        ? "Locked in"
        : status === "skipped"
          ? compactTopRowTile
            ? "Benched"
            : "Benched yourself"
          : emptyPushLabel;
  const statusHeadlineGradient =
    status === "completed"
      ? "linear-gradient(180deg, rgba(43,87,56,0.96) 0%, rgba(23,54,35,0.98) 100%)"
      : status === "planned"
        ? "linear-gradient(180deg, rgba(130,102,56,0.95) 0%, rgba(86,66,34,0.98) 100%)"
        : status === "skipped"
          ? "linear-gradient(180deg, rgba(129,82,73,0.95) 0%, rgba(80,50,44,0.98) 100%)"
          : "linear-gradient(180deg, rgba(79,73,61,0.95) 0%, rgba(39,35,29,0.98) 100%)";
  const weekPlannedSurface =
    status === "planned"
      ? {
          background:
            "linear-gradient(180deg, rgba(252,246,229,0.95) 0%, rgba(244,231,195,0.90) 52%, rgba(234,214,165,0.82) 100%)",
          border: "1px solid rgba(191,158,95,0.30)",
        }
      : null;
  const statusHeadlineStyle = {
    color: headlineColor,
    backgroundImage: statusHeadlineGradient,
    backgroundSize: "100% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  function truncateWords(text, maxWords) {
    const raw = typeof text === "string" ? text.trim() : "";
    if (!raw) return "";
    const words = raw.split(/\s+/);
    if (words.length <= maxWords) return raw;
    return `${words.slice(0, maxWords).join(" ")}…`;
  }

  const detailLabel = resolvedEntry?.time || resolvedEntry?.focus
    ? `${resolvedEntry?.time || ""}${resolvedEntry?.time && resolvedEntry?.focus ? " • " : ""}${truncateWords(
      resolvedEntry?.focus || "",
      compactWeekTile ? 2 : 4
    )}`.trim()
    : emptyDetailLabel;

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
        ...(weekPlannedSurface || {}),
        borderRadius: 18,
        padding: compactWeekTile ? 11 : 14,
        position: "relative",
        textAlign: "left",
        aspectRatio: compactWeekTile ? "auto" : "1 / 1",
        minHeight: compactWeekTile ? 118 : 124,
        maxHeight: compactWeekTile ? undefined : 200,
        cursor: "pointer",
        width: "100%",
        color: headlineColor,
        WebkitTextFillColor: headlineColor,
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: compactWeekTile ? 11 : 12, opacity: 0.72, fontWeight: 700, letterSpacing: 0.2, color: headlineColor }}>
          {dow}
        </div>
        <div
          style={{
            fontSize: compactTopRowTile ? 11 : compactWeekTile ? 12 : 13,
            fontWeight: 600,
            letterSpacing: 0.06,
            color: headlineColor,
          }}
        >
          {md}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: showTodayQuickActions ? 8 : 0,
          paddingTop: compactWeekTile ? 6 : 8,
          paddingBottom: compactWeekTile ? 6 : 8,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: compactWeekTile ? 13 : 15,
            fontWeight: 600,
            lineHeight: 1.15,
            color: headlineColor,
            letterSpacing: 0.06,
          }}
        >
          <span style={statusHeadlineStyle}>{statusHeadlineLabel}</span>
        </div>

        {showTodayQuickActions && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
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
                padding: compactWeekTile ? "4px 7px" : "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(72,150,92,0.24)",
                background:
                  "linear-gradient(180deg, rgba(225,241,227,0.95) 0%, rgba(199,226,204,0.9) 58%, rgba(173,210,183,0.86) 100%)",
                color: "#1d3b27",
                fontSize: compactWeekTile ? 12 : 13,
                fontWeight: 500,
                letterSpacing: 0.05,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
                transition: "transform 120ms ease, box-shadow 120ms ease",
                boxShadow: "0 2px 8px rgba(25,70,40,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(25,70,40,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(25,70,40,0.12)";
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.35), 0 2px 8px rgba(25,70,40,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(25,70,40,0.12)";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              👍
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
                padding: compactWeekTile ? "4px 7px" : "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(186,134,123,0.25)",
                background:
                  "linear-gradient(180deg, rgba(250,238,233,0.96) 0%, rgba(241,214,206,0.9) 58%, rgba(230,191,180,0.86) 100%)",
                color: "#6f463f",
                fontSize: compactWeekTile ? 12 : 13,
                fontWeight: 500,
                letterSpacing: 0.05,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                outline: "none",
                transition: "transform 120ms ease, box-shadow 120ms ease",
                boxShadow: "0 2px 8px rgba(110,68,60,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(110,68,60,0.19)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(110,68,60,0.12)";
              }}
              onFocus={(e) => {
                if (!e.currentTarget.matches(":focus-visible")) return;
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(245,158,11,0.35), 0 2px 8px rgba(110,68,60,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(110,68,60,0.12)";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              👎
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 6,
          fontSize: compactWeekTile ? 11 : 12,
          color: "rgba(12,14,18,0.84)",
          opacity: 0.76,
          lineHeight: 1.25,
          textAlign: "center",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {detailLabel}
      </div>

    </button>
  );
}
