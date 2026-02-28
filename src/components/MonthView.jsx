import React from "react";
import { addDays, formatRange, isSameWeekMonday, startOfWeekMonday, toISODate } from "../app/date-utils";
import { Button } from "./ui";
import { MonthCell } from "./MonthCell";
import { MonthInspector } from "./MonthInspector";

export function MonthView({
  prevMonthLabel,
  nextMonthLabel,
  onPrevMonth,
  onNextMonth,
  isCompactMonthGrid,
  monthGridStart,
  monthAnchor,
  monthFocusISO,
  onSelectDay,
  entriesByISO,
  todayISO,
  inspectorProps,
}) {
  const selectedWeekLabel = formatRange(startOfWeekMonday(new Date(monthFocusISO + "T00:00:00")));

  return (
    <>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Button onClick={onPrevMonth}>◀ {prevMonthLabel}</Button>
        <Button onClick={onNextMonth}>{nextMonthLabel} ▶</Button>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, opacity: 0.6, fontWeight: 600 }}>Selected week: {selectedWeekLabel}</div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: "1 1 660px", minWidth: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: isCompactMonthGrid ? 6 : 10,
              padding: "0 8px",
              color: "rgba(11,18,32,0.60)",
              fontSize: isCompactMonthGrid ? 11 : 12,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            {(isCompactMonthGrid ? ["M", "T", "W", "T", "F", "S", "S"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).map((x, i) => (
              <div key={`${x}-${i}`} style={{ textAlign: "left" }}>
                {x}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: isCompactMonthGrid ? 6 : 8 }}>
            {Array.from({ length: 6 }).map((_, row) => {
              const rowStart = addDays(monthGridStart, row * 7);
              const rowISO = toISODate(rowStart);
              const isFocusedWeek = isSameWeekMonday(monthFocusISO, rowISO);

              return (
                <div
                  key={row}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: isCompactMonthGrid ? 6 : 10,
                    padding: isCompactMonthGrid ? 1 : 2,
                    borderRadius: 14,
                    transition: "background 160ms ease",
                    background: isFocusedWeek ? "rgba(221, 202, 171, 0.20)" : "transparent",
                  }}
                >
                  {Array.from({ length: 7 }).map((__, col) => {
                    const d = addDays(rowStart, col);
                    const iso = toISODate(d);
                    const inMonth = d.getMonth() === monthAnchor.getMonth();

                    return (
                      <MonthCell
                        key={iso}
                        dateObj={d}
                        inMonth={inMonth}
                        entry={entriesByISO[iso]}
                        todayISO={todayISO}
                        selectedISO={monthFocusISO}
                        isCompactMonthGrid={isCompactMonthGrid}
                        onSelect={onSelectDay}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: "1 1 300px", minWidth: 280, maxWidth: 360 }}>
          <MonthInspector {...inspectorProps} />
        </div>
      </div>
    </>
  );
}
