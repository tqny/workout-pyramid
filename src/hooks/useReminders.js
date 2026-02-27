import { useCallback, useEffect, useRef, useState } from "react";
import { formatClockTime, parseTimeToMinutes } from "../app/date-utils";
import {
  DEFAULT_REMINDER_SETTINGS,
  normalizeReminderSettings,
  REMINDER_SENT_KEY,
  REMINDER_SETTINGS_KEY,
} from "../app/reminder-utils";

function loadReminderSettings() {
  try {
    const raw = localStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) return DEFAULT_REMINDER_SETTINGS;
    return normalizeReminderSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

function saveReminderSettings(settings) {
  try {
    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(normalizeReminderSettings(settings)));
  } catch {
    // ignore
  }
}

function loadSentMap() {
  try {
    const raw = localStorage.getItem(REMINDER_SENT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveSentMap(map) {
  try {
    localStorage.setItem(REMINDER_SENT_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function pruneSentMap(map) {
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 14;
  const next = {};
  for (const [key, when] of Object.entries(map)) {
    const stamp = new Date(when).getTime();
    if (Number.isFinite(stamp) && stamp >= cutoff) {
      next[key] = when;
    }
  }
  return next;
}

function dateFromISOTime(iso, hhmm) {
  const minutes = parseTimeToMinutes(hhmm);
  if (minutes == null) return null;
  const date = new Date(iso + "T00:00:00");
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

export function useReminders({ todayISO, todayEntry, todayStatus }) {
  const [settings, setSettings] = useState(() => loadReminderSettings());
  const supportsNotifications = typeof window !== "undefined" && "Notification" in window;
  const [permission, setPermission] = useState(() =>
    supportsNotifications ? Notification.permission : "unsupported"
  );

  const plannedTimerRef = useRef(null);
  const dailyTimerRef = useRef(null);

  useEffect(() => {
    saveReminderSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (!supportsNotifications) return undefined;
    function syncPermission() {
      setPermission(Notification.permission);
    }
    window.addEventListener("focus", syncPermission);
    document.addEventListener("visibilitychange", syncPermission);
    return () => {
      window.removeEventListener("focus", syncPermission);
      document.removeEventListener("visibilitychange", syncPermission);
    };
  }, [supportsNotifications]);

  function clearTimer(ref) {
    if (!ref.current) return;
    clearTimeout(ref.current);
    ref.current = null;
  }

  const notifyOnce = useCallback(({ key, body }) => {
    if (!supportsNotifications || Notification.permission !== "granted") return false;
    const sentMap = pruneSentMap(loadSentMap());
    if (sentMap[key]) {
      saveSentMap(sentMap);
      return false;
    }

    try {
      new Notification("Workout Pyramid", {
        body,
        tag: key,
      });
      sentMap[key] = new Date().toISOString();
      saveSentMap(sentMap);
      return true;
    } catch {
      saveSentMap(sentMap);
      return false;
    }
  }, [supportsNotifications]);

  useEffect(() => {
    clearTimer(plannedTimerRef);
    clearTimer(dailyTimerRef);

    if (!settings.enabled) return undefined;
    if (!supportsNotifications || permission !== "granted") return undefined;

    function scheduleNotification({ ref, targetDate, key, body }) {
      if (!targetDate) return;
      const delay = targetDate.getTime() - Date.now();
      if (delay <= 0) {
        notifyOnce({ key, body });
        return;
      }

      ref.current = setTimeout(() => {
        notifyOnce({ key, body });
        ref.current = null;
      }, delay);
    }

    if (todayStatus === "planned" && todayEntry?.time) {
      const plannedTarget = dateFromISOTime(todayISO, todayEntry.time);
      const key = `plan:${todayISO}:${todayEntry.time}`;
      const plannedClock = formatClockTime(todayEntry.time) || todayEntry.time;
      scheduleNotification({
        ref: plannedTimerRef,
        targetDate: plannedTarget,
        key,
        body: `You committed for ${plannedClock}. Start now and keep your word.`,
      });
    }

    const unresolvedToday = todayStatus !== "completed" && todayStatus !== "skipped";
    if (unresolvedToday && settings.dailyCheckTime) {
      const dailyTarget = dateFromISOTime(todayISO, settings.dailyCheckTime);
      const key = `log:${todayISO}:${settings.dailyCheckTime}`;
      const reminderClock = formatClockTime(settings.dailyCheckTime) || settings.dailyCheckTime;
      scheduleNotification({
        ref: dailyTimerRef,
        targetDate: dailyTarget,
        key,
        body: `${reminderClock} check-in: log today's result before day-end.`,
      });
    }

    return () => {
      clearTimer(plannedTimerRef);
      clearTimer(dailyTimerRef);
    };
  }, [
    notifyOnce,
    permission,
    settings.dailyCheckTime,
    settings.enabled,
    supportsNotifications,
    todayEntry?.time,
    todayISO,
    todayStatus,
  ]);

  const setRemindersEnabled = useCallback(async (nextEnabled) => {
    if (!supportsNotifications) {
      setSettings((prev) => ({ ...prev, enabled: false }));
      return false;
    }

    if (!nextEnabled) {
      setSettings((prev) => ({ ...prev, enabled: false }));
      return true;
    }

    let nextPermission = Notification.permission;
    if (nextPermission === "default") {
      try {
        nextPermission = await Notification.requestPermission();
      } catch {
        nextPermission = "denied";
      }
    }

    setPermission(nextPermission);
    if (nextPermission !== "granted") {
      setSettings((prev) => ({ ...prev, enabled: false }));
      return false;
    }

    setSettings((prev) => ({ ...prev, enabled: true }));
    return true;
  }, [supportsNotifications]);

  const setDailyCheckTime = useCallback((value) => {
    if (!value) return;
    setSettings((prev) => ({
      ...prev,
      dailyCheckTime: value,
    }));
  }, []);

  const replaceSettings = useCallback((nextValue) => {
    const normalized = normalizeReminderSettings(nextValue);
    if (!supportsNotifications || permission !== "granted") {
      normalized.enabled = false;
    }
    setSettings(normalized);
  }, [permission, supportsNotifications]);

  return {
    settings,
    permission,
    supportsNotifications,
    setRemindersEnabled,
    setDailyCheckTime,
    replaceSettings,
  };
}
