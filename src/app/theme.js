const TONES = {
  info: {
    background: "rgba(34, 211, 238, 0.16)",
    border: "1px solid rgba(34, 211, 238, 0.42)",
    color: "#d7fbff",
  },
  warning: {
    background: "rgba(250, 204, 21, 0.16)",
    border: "1px solid rgba(250, 204, 21, 0.44)",
    color: "#fff8d1",
  },
  positive: {
    background: "rgba(74, 222, 128, 0.18)",
    border: "1px solid rgba(74, 222, 128, 0.44)",
    color: "#dcffe9",
  },
  danger: {
    background: "rgba(248, 113, 113, 0.2)",
    border: "1px solid rgba(248, 113, 113, 0.4)",
    color: "#ffe1e1",
  },
  neutral: {
    background: "rgba(19, 31, 27, 0.9)",
    border: "1px solid rgba(86, 122, 110, 0.45)",
    color: "#d3e7dd",
  },
};

const STATUS_SURFACES = {
  completed: {
    background: "linear-gradient(180deg, rgba(22, 101, 52, 0.62) 0%, rgba(22, 163, 74, 0.35) 100%)",
    border: "1px solid rgba(74, 222, 128, 0.45)",
  },
  planned: {
    background: "linear-gradient(180deg, rgba(180, 83, 9, 0.44) 0%, rgba(250, 204, 21, 0.28) 100%)",
    border: "1px solid rgba(250, 204, 21, 0.5)",
  },
  skipped: {
    background: "linear-gradient(180deg, rgba(127, 29, 29, 0.56) 0%, rgba(220, 38, 38, 0.28) 100%)",
    border: "1px solid rgba(248, 113, 113, 0.46)",
  },
  empty: {
    background: "linear-gradient(180deg, rgba(14, 22, 20, 0.96) 0%, rgba(15, 28, 24, 0.92) 100%)",
    border: "1px solid rgba(64, 100, 89, 0.45)",
  },
};

export const THEME = {
  font:
    '"Space Grotesk", "Aldrich", "Saira Semi Condensed", "Trebuchet MS", "Segoe UI", sans-serif',
  ink: "#e9f8f0",
  inkMuted: "#9eb8ad",
  line: "rgba(86, 122, 110, 0.45)",
  panel: "rgba(8, 16, 14, 0.94)",
  panelSoft: "rgba(12, 22, 19, 0.9)",
  panelRaised: "rgba(16, 30, 26, 0.94)",
  pageGradient:
    "radial-gradient(circle at 10% -10%, rgba(34,197,94,0.2) 0%, rgba(2,8,7,0.95) 38%), linear-gradient(140deg, #030807 0%, #07110f 52%, #050a09 100%)",
  accent: {
    cyan: "#22d3ee",
    green: "#4ade80",
    yellow: "#facc15",
    red: "#f87171",
  },
  focusRing: "rgba(34, 211, 238, 0.42)",
  shadowSoft: "0 8px 20px rgba(0, 0, 0, 0.32)",
  shadow: "0 14px 34px rgba(0, 0, 0, 0.4)",
  shadowStrong: "0 20px 46px rgba(0, 0, 0, 0.48)",
};

export function toneStyle(tone) {
  return TONES[tone] || TONES.info;
}

export function statusSurface(status) {
  return STATUS_SURFACES[status] || STATUS_SURFACES.empty;
}
