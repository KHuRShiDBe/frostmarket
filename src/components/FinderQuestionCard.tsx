"use client";

import type { KeyboardEvent } from "react";

export interface FinderOption {
  value: string;
  label: string;
}

export default function FinderQuestionCard({
  title,
  options,
  selectedValue,
  onSelect,
}: {
  title: string;
  options: FinderOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex((o) => o.value === selectedValue);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = currentIndex === -1 ? 0 : Math.min(options.length - 1, currentIndex + 1);
      onSelect(options[nextIndex].value);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = currentIndex === -1 ? 0 : Math.max(0, currentIndex - 1);
      onSelect(options[prevIndex].value);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
      <div
        role="radiogroup"
        aria-label={title}
        onKeyDown={onKeyDown}
        className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {options.map((option) => {
          const active = option.value === selectedValue;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(option.value)}
              className={`rounded-2xl border-2 px-5 py-4 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-base ${
                active
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/50"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
