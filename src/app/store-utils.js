import { nowTimestampISO, toISODate } from "./date-utils";

const STORAGE_KEY = "workout_pyramid_store_v1";
const COMMIT_KEY = "workout_pyramid_last_commit_check";

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { days: {} };
    if (!parsed.days || typeof parsed.days !== "object") return { days: {} };
    return parsed;
  } catch {
    return { days: {} };
  }
}

export function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore
  }
}

export function getLastCommitCheck() {
  try {
    return localStorage.getItem(COMMIT_KEY) || "";
  } catch {
    return "";
  }
}

export function setLastCommitCheck(iso) {
  try {
    localStorage.setItem(COMMIT_KEY, iso);
  } catch {
    // ignore
  }
}

export function statusFromEntry(entry) {
  if (!entry) return "empty";
  return entry.status || "empty";
}

export function applyEntryAuditTimestamps(currentEntry, patch, options = {}) {
  const cur = currentEntry || {};
  const next = { ...cur, ...patch };
  const prevStatus = statusFromEntry(cur);
  const nextStatus = statusFromEntry(next);
  const nowISO = nowTimestampISO();
  const forcePlanStamp = options.forcePlanStamp === true;
  const forceCompleteStamp = options.forceCompleteStamp === true;

  if (nextStatus === "planned") {
    if (forcePlanStamp || prevStatus !== "planned") {
      next.plannedAt = nowISO;
    }
    delete next.completedAt;
    return next;
  }

  if (nextStatus === "completed") {
    if (forceCompleteStamp || prevStatus !== "completed") {
      next.completedAt = nowISO;
    }
    return next;
  }

  if (nextStatus === "skipped" || nextStatus === "empty") {
    delete next.completedAt;
    return next;
  }

  return next;
}

export function calculateStreaks(store) {
  const days = store.days || {};
  const today = toISODate(new Date());

  let currentStreak = 0;
  let checkDate = new Date();
  while (true) {
    const iso = toISODate(checkDate);
    if (days[iso]?.status === "completed") {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (iso === today && !days[iso]) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  let bestStreak = 0;
  let tempStreak = 0;
  const sortedDates = Object.keys(days)
    .filter((d) => days[d]?.status === "completed")
    .sort();

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedDates[i - 1] + "T00:00:00");
      const curr = new Date(sortedDates[i] + "T00:00:00");
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }

  return { current: currentStreak, best: Math.max(bestStreak, currentStreak) };
}

export function statusStyle(status) {
  if (status === "completed") {
    return {
      background:
        "linear-gradient(180deg, rgba(223, 240, 224, 0.94) 0%, rgba(199, 226, 204, 0.88) 52%, rgba(172, 210, 181, 0.78) 100%)",
      border: "1px solid rgba(72, 150, 92, 0.28)",
    };
  }
  if (status === "planned") {
    return {
      background:
        "linear-gradient(180deg, rgba(252,246,229,0.95) 0%, rgba(244,231,195,0.90) 52%, rgba(234,214,165,0.82) 100%)",
      border: "1px solid rgba(191,158,95,0.30)",
    };
  }
  if (status === "skipped") {
    return {
      background:
        "linear-gradient(180deg, rgba(250,236,232,0.95) 0%, rgba(240,214,207,0.9) 52%, rgba(228,190,180,0.82) 100%)",
      border: "1px solid rgba(181,129,117,0.30)",
    };
  }
  return {
    background:
      "linear-gradient(180deg, rgba(255,253,248,0.98) 0%, rgba(250,244,235,0.96) 56%, rgba(245,235,220,0.93) 100%)",
    border: "1px solid rgba(224, 210, 189, 0.92)",
  };
}
