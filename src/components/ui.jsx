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
        boxShadow: "0 4px 14px rgba(16, 24, 40, 0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({ children, onClick, style, disabled = false }) {
  const restingShadow = style?.boxShadow || "0 4px 14px rgba(16, 24, 40, 0.04)";

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
        background: THEME.panel,
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
          ? "0 0 0 3px rgba(59,130,246,0.28), 0 8px 22px rgba(16, 24, 40, 0.08)"
          : "0 8px 22px rgba(16, 24, 40, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = e.currentTarget.matches(":focus-visible")
          ? `0 0 0 3px rgba(59,130,246,0.28), ${restingShadow}`
          : restingShadow;
      }}
      onFocus={(e) => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(59,130,246,0.28), ${restingShadow}`;
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
          "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,249,252,0.92) 100%)",
        boxShadow: "0 8px 20px rgba(16, 24, 40, 0.06)",
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
            background: "rgba(255,255,255,0.95)",
            display: "grid",
            placeItems: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.5" y="2.5" width="23" height="23" rx="7" fill="#F7F9FC" stroke="#DFE5EE" />
            <path
              d="M7 17.5L11.2 12.2L14 15L17 10.5L21 17.5"
              stroke="#121826"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M9.5 20.5H18.5" stroke="#121826" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ lineHeight: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 1.2, opacity: 0.66 }}>WORKOUT</div>
          <div style={{ fontSize: 22, fontWeight: 950, marginTop: 4 }}>PYRAMID</div>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, marginTop: 8 }}>
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
            background: "rgba(255,255,255,0.95)",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: 0.5,
            opacity: 0.78,
          }}
        >
          {view === "week" ? "THIS WEEK" : "MONTH VIEW"}
        </div>
        <div
          style={{
            borderRadius: 999,
            padding: "6px 10px",
            border: `1px solid ${THEME.line}`,
            background: "rgba(255,255,255,0.95)",
            fontSize: 12,
            fontWeight: 800,
            opacity: 0.86,
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
        background: "rgba(0,0,0,0.35)",
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
          boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
