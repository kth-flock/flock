"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMonthWeeks(year: number, month: number): (Date | null)[][] {
  const leadingBlanks = new Date(year, month, 0).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function CalendarView() {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const weeks = getMonthWeeks(year, month);

  function changeMonth(offset: number) {
    setVisibleMonth(new Date(year, month + offset, 1));
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="flock-h2">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMonth(-1)}>
            Prev
          </button>
          <button type="button" onClick={() => changeMonth(1)}>
            Next
          </button>
        </div>
      </div>

      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th key={weekday} className="p-2 text-center flock-body-serif ">
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={twMerge(
                    "h-24 border align-top p-2",
                    !day ? "bg-neutral/50" : "",
                  )}
                >
                  {day && (
                    <span
                      className={
                        isSameDay(day, today) ? "font-bold relative" : ""
                      }
                    >
                      <span className="relative z-10">{day.getDate()}</span>
                      {isSameDay(day, today) && (
                        <span className="absolute inset-0 h-full scale-120 bg-secondary/50 z-0 rounded-full aspect-square " />
                      )}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
