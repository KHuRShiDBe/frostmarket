"use client";

import { useLocale } from "@/context/LocaleContext";

export default function FinderProgress({ current, total }: { current: number; total: number }) {
  const { t } = useLocale();
  const percent = Math.round((current / total) * 100);

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>{t.finder.progress(current, total)}</span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t.finder.progress(current, total)}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className="h-full rounded-full bg-sky-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
