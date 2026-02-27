import React, { useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  formatClockTime,
  formatOverdueDuration,
  formatRange,
  parseTimeToMinutes,
  startOfCalendarGridMonday,
  startOfWeekMonday,
  toISODate,
} from "./app/date-utils";
import { hasSeenOnboarding, markOnboardingSeen } from "./app/onboarding-utils";
import { calculateStreaks, statusFromEntry } from "./app/store-utils";
import { THEME } from "./app/theme";
import { CommitmentModal } from "./components/CommitmentModal";
import { CloudSyncModal } from "./components/CloudSyncModal";
import { DayEditorModal } from "./components/DayEditorModal";
import { HeaderCard } from "./components/HeaderCard";
import { InstallAppModal } from "./components/InstallAppModal";
import { MonthView } from "./components/MonthView";
import { ProductActionsBar } from "./components/ProductActionsBar";
import { WelcomeModal } from "./components/WelcomeModal";
import { WeekView } from "./components/WeekView";
import { WeeklyReviewModal } from "./components/WeeklyReviewModal";
import { useCommitmentFlow } from "./hooks/useCommitmentFlow";
import { useCloudSync } from "./hooks/useCloudSync";
import { useDayEditor } from "./hooks/useDayEditor";
import { useInstallPrompt } from "./hooks/useInstallPrompt";
import { useReminders } from "./hooks/useReminders";
import { useViewportWidth } from "./hooks/useViewportWidth";
import { useWorkoutStore } from "./hooks/useWorkoutStore";

export default function App() {
  const [view, setView] = useState("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const { store, setStore, upsertEntry, clearEntry } = useWorkoutStore();
  const viewportWidth = useViewportWidth(1200);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => !hasSeenOnboarding());
  const [notice, setNotice] = useState(null);
  const [templateDays, setTemplateDays] = useState([0, 2, 4, 5]);
  const [templateTime, setTemplateTime] = useState("18:00");

  const todayISO = toISODate(new Date());
  const [monthFocusISO, setMonthFocusISO] = useState(todayISO);

  const monday = useMemo(() => {
    if (view === "week") {
      const base = startOfWeekMonday(new Date());
      return addDays(base, weekOffset * 7);
    }
    return startOfWeekMonday(new Date(monthFocusISO + "T00:00:00"));
  }, [view, weekOffset, monthFocusISO]);

  const daysMonToSun = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(monday, i)), [monday]);

  const monthAnchor = useMemo(() => addMonths(new Date(), monthOffset), [monthOffset]);
  const monthGridStart = useMemo(() => startOfCalendarGridMonday(monthAnchor), [monthAnchor]);
  const monthLabel = useMemo(
    () => monthAnchor.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    [monthAnchor]
  );
  const prevMonth = useMemo(() => addMonths(monthAnchor, -1), [monthAnchor]);
  const nextMonth = useMemo(() => addMonths(monthAnchor, 1), [monthAnchor]);
  const prevMonthLabel = useMemo(
    () => prevMonth.toLocaleDateString(undefined, { month: "short" }),
    [prevMonth]
  );
  const nextMonthLabel = useMemo(
    () => nextMonth.toLocaleDateString(undefined, { month: "short" }),
    [nextMonth]
  );
  const weekRangeLabel = useMemo(() => formatRange(monday), [monday]);

  const weekCompletedCount = useMemo(() => {
    let count = 0;
    for (const d of daysMonToSun) {
      const iso = toISODate(d);
      if (store.days[iso]?.status === "completed") count += 1;
    }
    return count;
  }, [daysMonToSun, store.days]);

  const remaining = Math.max(0, 4 - weekCompletedCount);
  const streaks = useMemo(() => calculateStreaks(store), [store]);
  const weekSummary = useMemo(() => {
    let completed = 0;
    let planned = 0;
    let skipped = 0;
    let open = 0;

    const rows = daysMonToSun.map((d) => {
      const iso = toISODate(d);
      const entry = store.days[iso] || null;
      const status = statusFromEntry(entry);
      if (status === "completed") completed += 1;
      else if (status === "planned") planned += 1;
      else if (status === "skipped") skipped += 1;
      else open += 1;

      return {
        iso,
        label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
        statusLabel:
          status === "completed"
            ? "Completed"
            : status === "planned"
              ? "Planned"
              : status === "skipped"
                ? "Skipped"
                : "Open",
        time: entry?.time || "",
      };
    });

    const logged = completed + skipped;
    const completionRate = logged > 0 ? Math.round((completed / logged) * 100) : 0;

    return {
      completed,
      planned,
      skipped,
      open,
      completionRate,
      rows,
    };
  }, [daysMonToSun, store.days]);

  const todayEntry = store.days[todayISO] || null;
  const todayStatus = statusFromEntry(todayEntry);
  const selectedISO = monthFocusISO;
  const selectedEntry = selectedISO ? store.days[selectedISO] || null : null;
  const selectedStatus = statusFromEntry(selectedEntry);
  const isSelectedToday = selectedISO === todayISO;

  const dayEditor = useDayEditor({ days: store.days, upsertEntry, clearEntry });
  const commitment = useCommitmentFlow({ todayISO, todayEntry, upsertEntry });
  const reminders = useReminders({ todayISO, todayEntry, todayStatus });
  const cloudSync = useCloudSync({
    store,
    remindersSettings: reminders.settings,
    setStore,
    replaceReminderSettings: reminders.replaceSettings,
    onNotice: setNotice,
  });
  const installPrompt = useInstallPrompt();

  const isPhone = viewportWidth < 640;
  const isCompactMonthGrid = viewportWidth < 760;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const plannedMinutes = parseTimeToMinutes(todayEntry?.time);
  const isPastPlannedTime = todayStatus === "planned" && plannedMinutes != null && nowMinutes >= plannedMinutes;
  const overduePlannedMinutes = isPastPlannedTime ? nowMinutes - plannedMinutes : null;
  const overduePlannedTimeLabel = isPastPlannedTime ? formatClockTime(todayEntry?.time) : "";
  const overdueDurationLabel = isPastPlannedTime ? formatOverdueDuration(overduePlannedMinutes) : "";

  const dashboardPrompt = useMemo(() => {
    if (todayStatus === "completed") {
      return { tone: "positive", text: "Today is logged. Protect the streak by planning tomorrow." };
    }
    if (weekCompletedCount >= 4) {
      return { tone: "positive", text: "Weekly goal reached. Anything extra now is bonus momentum." };
    }
    if (todayStatus === "planned" && isPastPlannedTime) {
      const when = overduePlannedTimeLabel || "earlier";
      const lag = overdueDurationLabel ? ` (${overdueDurationLabel})` : "";
      return { tone: "warning", text: `You planned for ${when}${lag}. Mark the outcome to stay honest.` };
    }
    if (todayStatus === "planned") {
      const when = formatClockTime(todayEntry?.time);
      return { tone: "info", text: when ? `Today's session is set for ${when}.` : "You have a plan for today." };
    }
    if (todayStatus === "skipped") {
      return { tone: "info", text: "Recovery is valid. Re-plan when you're ready." };
    }
    if (remaining <= 1) {
      return { tone: "warning", text: "One more workout this week will hit your goal." };
    }
    return { tone: "info", text: `${remaining} workouts left this week. Pick one and lock the time.` };
  }, [
    overdueDurationLabel,
    overduePlannedTimeLabel,
    remaining,
    todayEntry?.time,
    todayStatus,
    weekCompletedCount,
    isPastPlannedTime,
  ]);
  const cloudSyncLabel = !cloudSync.isConfigured
    ? "Cloud setup"
    : cloudSync.user
      ? "Cloud connected"
      : "Cloud sign in";
  const cloudSyncTone = !cloudSync.isConfigured
    ? "warning"
    : cloudSync.user
      ? "positive"
      : "info";
  const installLabel = installPrompt.isStandalone
    ? "Installed"
    : installPrompt.isIOS
      ? "Add to Home Screen"
      : "Install app";
  const installTone = installPrompt.isStandalone ? "positive" : "info";

  function openDayEditor(iso) {
    dayEditor.openDayEditor(iso);
  }

  function closeWelcomeModal() {
    markOnboardingSeen();
    setShowWelcomeModal(false);
  }

  function openCloudFromWelcome() {
    closeWelcomeModal();
    setShowCloudSyncModal(true);
  }

  function openInstallFromWelcome() {
    closeWelcomeModal();
    setShowInstallModal(true);
  }

  function handleMonthCellClick(iso) {
    setMonthFocusISO(iso);
  }

  function handleTemplateDayToggle(dayIndex) {
    setTemplateDays((prev) => {
      if (prev.includes(dayIndex)) {
        return prev.filter((d) => d !== dayIndex);
      }
      return [...prev, dayIndex].sort((a, b) => a - b);
    });
  }

  function applyNextWeekTemplate() {
    const nextMonday = addDays(monday, 7);
    let plannedCount = 0;
    let preservedCount = 0;

    for (const dayIndex of templateDays) {
      const iso = toISODate(addDays(nextMonday, dayIndex));
      if (store.days[iso]) {
        preservedCount += 1;
        continue;
      }

      upsertEntry(
        iso,
        {
          status: "planned",
          time: templateTime,
          focus: "",
        },
        { forcePlanStamp: true }
      );
      plannedCount += 1;
    }

    setNotice({
      tone: plannedCount > 0 ? "positive" : "warning",
      text:
        plannedCount > 0
          ? `Planned ${plannedCount} day(s) for next week. Preserved ${preservedCount} existing entry(s).`
          : `No new days planned. Preserved ${preservedCount} existing entry(s).`,
    });

    setShowReviewModal(false);
  }

  const inspectorProps = {
    todayISO,
    selectedISO,
    selectedEntry,
    selectedStatus,
    isSelectedToday,
    isPastPlannedTime,
    overduePlannedTimeLabel,
    overdueDurationLabel,
    todayStatus,
    onOpenCommitPlanner: commitment.openCommitPlanner,
    onMarkTodayCompleted: commitment.markTodayCompleted,
    onMarkTodaySkipped: commitment.markTodaySkipped,
    onEditSelectedDay: () => {
      if (selectedISO) openDayEditor(selectedISO);
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 8% 0%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.65) 24%, rgba(238,242,247,1) 70%)",
        color: THEME.ink,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: 22 }}>
        <HeaderCard
          view={view}
          weekRangeLabel={weekRangeLabel}
          monthLabel={monthLabel}
          weekCompletedCount={weekCompletedCount}
          remaining={remaining}
          streaks={streaks}
          dashboardPrompt={dashboardPrompt}
          onToggleView={() => setView(view === "week" ? "month" : "week")}
        />

        <ProductActionsBar
          cloudSyncLabel={cloudSyncLabel}
          cloudSyncTone={cloudSyncTone}
          onOpenCloudSync={() => setShowCloudSyncModal(true)}
          installLabel={installLabel}
          installTone={installTone}
          onOpenInstall={() => setShowInstallModal(true)}
          disableInstall={installPrompt.isStandalone}
          onOpenReview={() => setShowReviewModal(true)}
          notice={notice}
        />

        <div
          style={{
            marginTop: 14,
            borderRadius: 22,
            border: `1px solid ${THEME.line}`,
            background: "rgba(247,249,252,0.95)",
            padding: 18,
            boxShadow: THEME.shadow,
          }}
        >
          {view === "week" ? (
            <WeekView
              days={daysMonToSun}
              entriesByISO={store.days}
              todayISO={todayISO}
              isPhone={isPhone}
              onOpenEditor={openDayEditor}
              onMarkTodayCompleted={commitment.markTodayCompleted}
              onMarkTodaySkipped={commitment.markTodaySkipped}
              onPrevWeek={() => setWeekOffset((v) => v - 1)}
              onResetWeek={() => setWeekOffset(0)}
              onNextWeek={() => setWeekOffset((v) => v + 1)}
            />
          ) : (
            <MonthView
              prevMonthLabel={prevMonthLabel}
              nextMonthLabel={nextMonthLabel}
              onPrevMonth={() => setMonthOffset((v) => v - 1)}
              onNextMonth={() => setMonthOffset((v) => v + 1)}
              isCompactMonthGrid={isCompactMonthGrid}
              monthGridStart={monthGridStart}
              monthAnchor={monthAnchor}
              monthFocusISO={monthFocusISO}
              onSelectDay={handleMonthCellClick}
              entriesByISO={store.days}
              todayISO={todayISO}
              inspectorProps={inspectorProps}
            />
          )}
        </div>
      </div>

      <CommitmentModal
        open={!showWelcomeModal && commitment.isCommitModalOpen}
        onClose={commitment.closeCommitModal}
        step={commitment.commitStep}
        commitTime={commitment.commitTime}
        onChangeCommitTime={commitment.setCommitTime}
        onYes={commitment.handleCommitYes}
        onNo={commitment.handleCommitNo}
        onBack={commitment.goBackCommitStep}
        onSave={commitment.handleCommitSave}
      />

      <DayEditorModal
        open={!!dayEditor.activeISO}
        onClose={dayEditor.closeDayEditor}
        activeISO={dayEditor.activeISO}
        draftStatus={dayEditor.draftStatus}
        setDraftStatus={dayEditor.setDraftStatus}
        draftTime={dayEditor.draftTime}
        setDraftTime={dayEditor.setDraftTime}
        draftFocus={dayEditor.draftFocus}
        setDraftFocus={dayEditor.setDraftFocus}
        onClearEntry={dayEditor.clearActiveEntry}
        onSave={dayEditor.saveDayEditor}
      />

      <CloudSyncModal
        open={showCloudSyncModal || cloudSync.authMode === "reset"}
        onClose={() => {
          if (cloudSync.authMode === "reset") {
            cloudSync.setAuthMode("signin");
          }
          setShowCloudSyncModal(false);
        }}
        cloudSync={cloudSync}
      />

      <InstallAppModal
        open={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isIOS={installPrompt.isIOS}
        isStandalone={installPrompt.isStandalone}
        canNativeInstallPrompt={installPrompt.canNativeInstallPrompt}
        onPromptInstall={async () => {
          const result = await installPrompt.promptInstall();
          if (result.didPrompt && result.accepted) {
            setNotice({ tone: "positive", text: "Install accepted. Launch from your home screen." });
          } else if (result.didPrompt) {
            setNotice({ tone: "info", text: "Install prompt dismissed. You can try again anytime." });
          }
          setShowInstallModal(false);
        }}
      />

      <WelcomeModal
        open={showWelcomeModal}
        onClose={closeWelcomeModal}
        onOpenCloudSync={openCloudFromWelcome}
        onOpenInstall={openInstallFromWelcome}
      />

      <WeeklyReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        weekRangeLabel={weekRangeLabel}
        summary={weekSummary}
        templateDays={templateDays}
        templateTime={templateTime}
        onTemplateDayToggle={handleTemplateDayToggle}
        onTemplateTimeChange={setTemplateTime}
        onApplyTemplate={applyNextWeekTemplate}
      />

    </div>
  );
}
