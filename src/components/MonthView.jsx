import React from "react";
import { addDays, isSameWeekMonday, toISODate } from "../app/date-utils";
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
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.62, fontWeight: 700 }}>
        Tap a date to inspect it, then use the panel to update details.
      </div>

      <div
        style={{
          marginTop: 14,
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
              fontWeight: 800,
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
                    transition: "box-shadow 160ms ease, background 160ms ease",
                    boxShadow: isFocusedWeek ? "inset 0 0 0 1px rgba(147,197,253,0.38)" : "none",
                    background: isFocusedWeek ? "rgba(147,197,253,0.06)" : "transparent",
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
