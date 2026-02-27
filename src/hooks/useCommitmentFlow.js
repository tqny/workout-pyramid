import { useState } from "react";
import { getLastCommitCheck, setLastCommitCheck } from "../app/store-utils";

export function useCommitmentFlow({ todayISO, todayEntry, upsertEntry }) {
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [commitStep, setCommitStep] = useState("ask");
  const [commitTime, setCommitTime] = useState("");

  const shouldAutoPromptCommit = !todayEntry && getLastCommitCheck() !== todayISO;
  const isCommitModalOpen = showCommitModal || shouldAutoPromptCommit;

  function handleCommitYes() {
    setCommitStep("time");
  }

  function handleCommitNo() {
    upsertEntry(todayISO, { status: "skipped", time: "", focus: "Rest day" });
    setLastCommitCheck(todayISO);
    setShowCommitModal(false);
  }

  function handleCommitSave() {
    upsertEntry(
      todayISO,
      { status: "planned", time: commitTime.trim(), focus: todayEntry?.focus || "" },
      { forcePlanStamp: true }
    );
    setLastCommitCheck(todayISO);
    setShowCommitModal(false);
  }

  function closeCommitModal() {
    setShowCommitModal(false);
    setLastCommitCheck(todayISO);
  }

  function openCommitPlanner() {
    setCommitStep("ask");
    setCommitTime(todayEntry?.time || "");
    setShowCommitModal(true);
  }

  function goBackCommitStep() {
    setCommitStep("ask");
  }

  function markTodayCompleted() {
    upsertEntry(
      todayISO,
      {
        ...(todayEntry || {}),
        status: "completed",
      },
      { forceCompleteStamp: true }
    );
    setLastCommitCheck(todayISO);
  }

  function markTodaySkipped() {
    upsertEntry(todayISO, {
      ...(todayEntry || {}),
      status: "skipped",
      focus: todayEntry?.focus || "Rest day",
    });
    setLastCommitCheck(todayISO);
  }

  return {
    isCommitModalOpen,
    commitStep,
    commitTime,
    setCommitTime,
    handleCommitYes,
    handleCommitNo,
    handleCommitSave,
    closeCommitModal,
    openCommitPlanner,
    goBackCommitStep,
    markTodayCompleted,
    markTodaySkipped,
  };
}
