import { useState } from "react";

export function useDayEditor({ days, upsertEntry, clearEntry }) {
  const [activeISO, setActiveISO] = useState(null);
  const [draftStatus, setDraftStatus] = useState("planned");
  const [draftTime, setDraftTime] = useState("");
  const [draftFocus, setDraftFocus] = useState("");

  function openDayEditor(iso) {
    const entry = days[iso] || null;
    setDraftStatus(entry?.status || "planned");
    setDraftTime(entry?.time || "");
    setDraftFocus(entry?.focus || "");
    setActiveISO(iso);
  }

  function closeDayEditor() {
    setActiveISO(null);
  }

  function saveDayEditor() {
    if (!activeISO) return;
    upsertEntry(
      activeISO,
      {
        status: draftStatus,
        time: draftTime.trim(),
        focus: draftFocus.trim(),
      },
      {
        forcePlanStamp: draftStatus === "planned",
      }
    );
    closeDayEditor();
  }

  function clearActiveEntry() {
    if (!activeISO) return;
    clearEntry(activeISO);
    closeDayEditor();
  }

  return {
    activeISO,
    draftStatus,
    setDraftStatus,
    draftTime,
    setDraftTime,
    draftFocus,
    setDraftFocus,
    openDayEditor,
    closeDayEditor,
    saveDayEditor,
    clearActiveEntry,
  };
}
