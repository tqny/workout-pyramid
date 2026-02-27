import React from "react";
import { THEME } from "../app/theme";

export function Pill({ children, style }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        borderRadius: 16,
        border: `1px solid ${THEME.line}`,
        background: THEME.panel,
        padding: "11px 13px",
        boxShadow: THEME.shadowSoft,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, style, disabled = false }) {
  const restingShadow = style?.boxShadow || THEME.shadowSoft;

  function shouldReduceMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        boxSizing: "border-box",
        borderRadius: 14,
        border: `1px solid ${THEME.line}`,
        background: THEME.panelRaised,
        color: THEME.ink,
        padding: "10px 13px",
        fontWeight: 900,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: restingShadow,
        transition: "transform 120ms ease, box-shadow 120ms ease",
        opacity: disabled ? 0.55 : 1,
        outline: "none",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (!shouldReduceMotion()) e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = e.currentTarget.matches(":focus-visible")
          ? `0 0 0 3px ${THEME.focusRing}, ${THEME.shadow}`
          : THEME.shadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = e.currentTarget.matches(":focus-visible")
          ? `0 0 0 3px ${THEME.focusRing}, ${restingShadow}`
          : restingShadow;
      }}
      onFocus={(e) => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        e.currentTarget.style.boxShadow = `0 0 0 3px ${THEME.focusRing}, ${restingShadow}`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = restingShadow;
      }}
    >
      {children}
    </button>
  );
}

export function BrandMark({ view, weekRangeLabel, monthLabel }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "grid",
        gap: 12,
        width: "100%",
        minWidth: 0,
        minHeight: 118,
        padding: "16px 18px",
        borderRadius: 18,
        border: `1px solid ${THEME.line}`,
        background:
          "linear-gradient(180deg, rgba(12, 25, 21, 0.95) 0%, rgba(8, 16, 14, 0.95) 100%)",
        boxShadow: THEME.shadow,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            border: `1px solid ${THEME.line}`,
            background: "rgba(14, 29, 25, 0.98)",
            display: "grid",
            placeItems: "center",
            boxShadow: "inset 0 1px 0 rgba(142, 196, 174, 0.2)",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="2.5" width="23" height="23" rx="7" fill="#0E1B18" stroke="#3E6A5A" />
            <path
              d="M7 17.5L11.2 12.2L14 15L17 10.5L21 17.5"
              stroke="#4ADE80"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9.5 20.5H18.5" stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ lineHeight: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1.2, color: THEME.inkMuted }}>WORKOUT</div>
          <div style={{ fontSize: 22, fontWeight: 950, marginTop: 4 }}>PYRAMID</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: THEME.inkMuted, marginTop: 8 }}>
            Plan. Commit. Confirm.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", minWidth: 0 }}>
        <div
          style={{
            borderRadius: 999,
            padding: "6px 10px",
            border: `1px solid ${THEME.line}`,
            background: "rgba(14, 28, 24, 0.96)",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 0.5,
            color: THEME.inkMuted,
          }}
        >
          {view === "week" ? "THIS WEEK" : "MONTH VIEW"}
        </div>
        <div
          style={{
            borderRadius: 999,
            padding: "6px 10px",
            border: `1px solid ${THEME.line}`,
            background: "rgba(14, 28, 24, 0.96)",
            fontSize: 12,
            fontWeight: 800,
            color: THEME.ink,
          }}
        >
          {view === "week" ? weekRangeLabel : monthLabel}
        </div>
      </div>
    </div>
  );
}

export function ModalShell({ open, onClose, children, noCloseOnBackdrop = false }) {
  if (!open) return null;
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !noCloseOnBackdrop) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 5, 4, 0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          borderRadius: 22,
          background: THEME.panel,
          border: `1px solid ${THEME.line}`,
          boxShadow: THEME.shadowStrong,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
