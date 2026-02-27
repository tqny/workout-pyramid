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
      background: "rgba(187, 247, 208, 0.65)",
      border: "1px solid rgba(16,185,129,0.18)",
    };
  }
  if (status === "planned") {
    return {
      background: "rgba(253, 230, 92, 0.42)",
      border: "1px solid rgba(202,138,4,0.22)",
    };
  }
  if (status === "skipped") {
    return {
      background: "rgba(254, 202, 202, 0.60)",
      border: "1px solid rgba(239,68,68,0.18)",
    };
  }
  return { background: "#ffffff", border: "1px solid #e6e9ef" };
}
