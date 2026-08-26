"use client";

import { useLocale } from "@/context/LocaleContext";

export type CheckoutStep = "information" | "delivery" | "payment" | "complete";

const STEP_ORDER: CheckoutStep[] = ["information", "delivery", "payment", "complete"];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CheckoutStepper({ current }: { current: CheckoutStep }) {
  const { t } = useLocale();
  const currentIndex = STEP_ORDER.indexOf(current);

  return (
    <ol className="flex items-center">
      {STEP_ORDER.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step} className={`flex items-center ${i < STEP_ORDER.length - 1 ? "flex-1" : ""}`}>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isCurrent
                    ? "bg-sky-600 text-white"
                    : isDone
                      ? "bg-sky-100 text-sky-600"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? <CheckIcon /> : i + 1}
              </span>
              <span
                className={`hidden text-xs font-medium sm:inline ${
                  isCurrent ? "text-slate-900" : isDone ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {t.checkout.steps[step]}
              </span>
            </div>
            {i < STEP_ORDER.length - 1 && (
              <span className={`mx-2 h-px flex-1 sm:mx-3 ${isDone ? "bg-sky-300" : "bg-slate-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
