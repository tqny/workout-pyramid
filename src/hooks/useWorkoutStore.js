import { useEffect, useState } from "react";
import { applyEntryAuditTimestamps, loadStore, saveStore } from "../app/store-utils";

export function useWorkoutStore() {
  const [store, setStore] = useState(() => loadStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  function upsertEntry(iso, patch, options = {}) {
    setStore((prev) => {
      const cur = prev.days[iso] || {};
      const nextEntry = applyEntryAuditTimestamps(cur, patch, options);
      return {
        ...prev,
        days: {
          ...prev.days,
          [iso]: nextEntry,
        },
      };
    });
  }

  function clearEntry(iso) {
    setStore((prev) => {
      const nextDays = { ...prev.days };
      delete nextDays[iso];
      return { ...prev, days: nextDays };
    });
  }

  return {
    store,
    setStore,
    upsertEntry,
    clearEntry,
  };
}
