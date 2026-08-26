"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLocale();

  return (
    <div className="max-w-2xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {t.faq.items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6 sm:py-5"
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">
                {item.q}
              </span>
              <ChevronIcon open={open} />
            </button>
            <div
              className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden px-5 pb-4 sm:px-6 sm:pb-5">
                <p className="text-sm leading-relaxed text-slate-500 sm:text-base">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
