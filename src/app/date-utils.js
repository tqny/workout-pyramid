function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function startOfWeekMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

export function startOfCalendarGridMonday(monthAnchor) {
  const first = startOfMonth(monthAnchor);
  return startOfWeekMonday(first);
}

export function formatRange(monday) {
  const sunday = addDays(monday, 6);
  const opts = { month: "short", day: "numeric" };
  const a = monday.toLocaleDateString(undefined, opts);
  const b = sunday.toLocaleDateString(undefined, opts);
  return `${a} – ${b}`;
}

export function isSameWeekMonday(aISO, bISO) {
  const a = startOfWeekMonday(new Date(aISO + "T00:00:00"));
  const b = startOfWeekMonday(new Date(bISO + "T00:00:00"));
  return toISODate(a) === toISODate(b);
}

export function parseTimeToMinutes(value) {
  if (!value || typeof value !== "string" || !value.includes(":")) return null;
  const [hh, mm] = value.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  return hh * 60 + mm;
}

export function nowTimestampISO() {
  return new Date().toISOString();
}

export function formatClockTime(value) {
  if (!value || typeof value !== "string" || !value.includes(":")) return value || "";
  const [hh, mm] = value.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return value;
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatOverdueDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes < 0) return "";
  if (minutes === 0) return "right now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h ago`;
  return `${hours}h ${mins}m ago`;
}

export function formatAuditTimestamp(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
