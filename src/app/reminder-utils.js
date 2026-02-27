export const REMINDER_SETTINGS_KEY = "workout_pyramid_reminder_settings_v1";
export const REMINDER_SENT_KEY = "workout_pyramid_reminder_sent_v1";

export const DEFAULT_REMINDER_SETTINGS = {
  enabled: false,
  dailyCheckTime: "20:30",
};

export function isValidTimeString(value) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
}

export function normalizeReminderSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    enabled: source.enabled === true,
    dailyCheckTime: isValidTimeString(source.dailyCheckTime)
      ? source.dailyCheckTime
      : DEFAULT_REMINDER_SETTINGS.dailyCheckTime,
  };
}
