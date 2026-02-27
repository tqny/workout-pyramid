import { normalizeReminderSettings } from "./reminder-utils";

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeEntry(entry) {
  if (!isObject(entry)) return null;
  const next = {};

  if (["planned", "completed", "skipped"].includes(entry.status)) {
    next.status = entry.status;
  }
  if (typeof entry.time === "string") next.time = entry.time;
  if (typeof entry.focus === "string") next.focus = entry.focus;
  if (typeof entry.plannedAt === "string") next.plannedAt = entry.plannedAt;
  if (typeof entry.completedAt === "string") next.completedAt = entry.completedAt;

  return Object.keys(next).length > 0 ? next : null;
}

export function normalizeStore(value) {
  if (!isObject(value) || !isObject(value.days)) {
    throw new Error("Backup is missing a valid store.days object.");
  }

  const days = {};
  for (const [iso, entry] of Object.entries(value.days)) {
    const normalized = normalizeEntry(entry);
    if (normalized) days[iso] = normalized;
  }

  return { days };
}

export function createBackupPayload({ store, reminders }) {
  return {
    schemaVersion: 1,
    app: "workout-pyramid",
    exportedAt: new Date().toISOString(),
    store: normalizeStore(store),
    reminders: normalizeReminderSettings(reminders),
  };
}

export function parseBackupText(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Backup file is not valid JSON.");
  }

  if (!isObject(parsed)) {
    throw new Error("Backup root must be an object.");
  }

  const storeCandidate = isObject(parsed.store) ? parsed.store : parsed;
  const store = normalizeStore(storeCandidate);
  const reminders = normalizeReminderSettings(parsed.reminders || {});

  return { store, reminders };
}
