"use client";

import { useLocale } from "@/context/LocaleContext";
import type { RatingSummary } from "@/services/reviews";

const STARS: (1 | 2 | 3 | 4 | 5)[] = [5, 4, 3, 2, 1];

/** 5-to-1 star breakdown bars, computed from the current review set. Doubles as a rating filter shortcut. */
export default function RatingDistribution({
  summary,
  activeFilter,
  onSelect,
}: {
  summary: RatingSummary;
  /** 0 means no rating filter is active. */
  activeFilter: number;
  onSelect: (rating: number) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-1.5">
      {STARS.map((star) => {
        const count = summary.distribution[star];
        const percent = summary.count > 0 ? (count / summary.count) * 100 : 0;
        const active = activeFilter === star;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onSelect(active ? 0 : star)}
            aria-pressed={active}
            aria-label={t.reviews.distribution.ariaLabel(star, count)}
            className={`flex items-center gap-2 rounded-lg px-1.5 py-1 text-xs transition-colors ${
              active ? "bg-sky-50" : "hover:bg-slate-100"
            }`}
          >
            <span className="w-8 shrink-0 text-left text-slate-500">{star}★</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <span className="block h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
            </span>
            <span className="w-6 shrink-0 text-right text-slate-400">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
