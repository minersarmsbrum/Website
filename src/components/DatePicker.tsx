"use client";

import { useEffect, useRef, useState } from "react";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Mo","Tu","We","Th","Fr","Sa","Su"];

interface Props {
  value: string;           // YYYY-MM-DD
  onChange: (val: string) => void;
  min?: string;            // YYYY-MM-DD — dates before this are disabled
  disabled?: boolean;
  className?: string;
  triggerClassName?: string; // override the trigger button classes
  placeholder?: string;
  error?: boolean;
}

function toLocalDate(yyyyMmDd: string) {
  return new Date(yyyyMmDd + "T00:00:00");
}

function formatDisplay(yyyyMmDd: string) {
  const d = toLocalDate(yyyyMmDd);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function toYMD(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DatePicker({
  value,
  onChange,
  min,
  disabled = false,
  className = "",
  triggerClassName,
  placeholder = "Select a date",
  error = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = min ? toLocalDate(min) : today;

  const initDate = value ? toLocalDate(value) : today;
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = toLocalDate(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  // First weekday of month (Mon = 0 … Sun = 6)
  const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // Disable prev-month button if the last day of prev month is before minDate
  const lastDayPrevMonth = new Date(viewYear, viewMonth, 0);
  const canGoPrev = lastDayPrevMonth >= minDate;

  function isDisabled(day: number) {
    return toLocalDate(toYMD(viewYear, viewMonth, day)) < minDate;
  }
  function isSelected(day: number) {
    return !!value && value === toYMD(viewYear, viewMonth, day);
  }
  function isToday(day: number) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function selectDay(day: number) {
    onChange(toYMD(viewYear, viewMonth, day));
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={
          triggerClassName ??
          `w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors outline-none disabled:opacity-50 ${
            error
              ? "border-ember-400 bg-ink-900/60 text-cream-50"
              : open
              ? "border-saffron-500/60 bg-ink-800 text-cream-100"
              : "border-cream-200/10 bg-ink-800 text-cream-100 hover:border-cream-200/20"
          }`
        }
      >
        {value
          ? formatDisplay(value)
          : <span className="text-cream-200/30">{placeholder}</span>}
      </button>

      {/* Calendar popover */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-cream-200/15 bg-ink-800 p-4 shadow-2xl">
          {/* Month nav */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-cream-200/60 transition-colors hover:bg-ink-700 hover:text-cream-100 disabled:cursor-not-allowed disabled:opacity-25"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-cream-50">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-cream-200/60 transition-colors hover:bg-ink-700 hover:text-cream-100"
            >
              ›
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7">
            {DAY_LABELS.map((d) => (
              <div key={d} className="py-1 text-center text-xs text-cream-200/40">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const sel = isSelected(day);
              const tod = isToday(day);
              const dis = isDisabled(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={dis}
                  onClick={() => selectDay(day)}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors ${
                    sel
                      ? "bg-saffron-500 font-semibold text-ink-900"
                      : tod
                      ? "border border-saffron-500/50 text-saffron-400 hover:bg-ink-700"
                      : dis
                      ? "cursor-not-allowed text-cream-200/20"
                      : "text-cream-100 hover:bg-ink-700 hover:text-cream-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
