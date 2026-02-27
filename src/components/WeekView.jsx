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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Button onClick={onPrevWeek} style={{ minWidth: 100, flex: "1 1 160px" }}>
          ◀ Previous week
        </Button>

        <Button onClick={onResetWeek} style={{ minWidth: 80, fontWeight: 950, flex: "0 1 120px" }}>
          This week
        </Button>

        <Button onClick={onNextWeek} style={{ minWidth: 100, flex: "1 1 160px" }}>
          Next week ▶
        </Button>
      </div>
    </>
  );
}
