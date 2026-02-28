import React from "react";
import { toISODate } from "../app/date-utils";
import { Button } from "./ui";
import { WeekDayTile } from "./WeekDayTile";

export function WeekView({
  days,
  entriesByISO,
  todayISO,
  isPhone,
  onOpenEditor,
  onMarkTodayCompleted,
  onMarkTodaySkipped,
  onPrevWeek,
  onResetWeek,
  onNextWeek,
}) {
  const [mon, tue, wed, thu, fri, sat, sun] = days;
  const stackBottomRow = isPhone;

  function tileProps(dateObj) {
    const iso = toISODate(dateObj);
    return {
      dateObj,
      entry: entriesByISO[iso],
      todayISO,
      isPhone,
      onOpenEditor,
      onMarkTodayCompleted,
      onMarkTodaySkipped,
    };
  }

  return (
    <>
      <div style={{ marginTop: 4, fontSize: 12, opacity: 0.62, fontWeight: 700 }}>
        Tap any day card to edit details.
      </div>
      <div style={{ marginTop: 14 }}>
        <div
          style={{
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: isPhone ? 8 : 12,
            width: "100%",
            maxWidth: isPhone ? 520 : 640,
          }}
        >
          <WeekDayTile {...tileProps(mon)} />
          <WeekDayTile {...tileProps(tue)} />
          <WeekDayTile {...tileProps(wed)} />
        </div>

        <div
          style={{
            margin: `${isPhone ? 8 : 12}px auto 0`,
            display: "grid",
            gridTemplateColumns: stackBottomRow
              ? "repeat(2, minmax(0, 1fr))"
              : "repeat(4, minmax(0, 1fr))",
            gap: isPhone ? 8 : 12,
            width: "100%",
            maxWidth: stackBottomRow ? 520 : 860,
          }}
        >
          <WeekDayTile {...tileProps(thu)} />
          <WeekDayTile {...tileProps(fri)} />
          <WeekDayTile {...tileProps(sat)} />
          <WeekDayTile {...tileProps(sun)} />
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <Button onClick={onPrevWeek} style={{ width: "100%", minHeight: 44, whiteSpace: "nowrap", fontWeight: 700 }}>
          {isPhone ? "◀ Prev" : "◀ Previous week"}
        </Button>

        <Button onClick={onResetWeek} style={{ width: "100%", minHeight: 44, whiteSpace: "nowrap", fontWeight: 700 }}>
          This week
        </Button>

        <Button onClick={onNextWeek} style={{ width: "100%", minHeight: 44, whiteSpace: "nowrap", fontWeight: 700 }}>
          {isPhone ? "Next ▶" : "Next week ▶"}
        </Button>
      </div>
    </>
  );
}
