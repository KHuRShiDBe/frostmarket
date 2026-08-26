"use client";

import { useLocale } from "@/context/LocaleContext";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import type { RevenuePoint } from "@/lib/admin/metrics";

/** Lightweight CSS bar chart — no charting library needed for a handful of daily revenue bars. */
export default function RevenueChart({ points }: { points: RevenuePoint[] }) {
  const { t, locale } = useLocale();
  const max = Math.max(1, ...points.map((point) => point.revenue));
  const hasData = points.some((point) => point.revenue > 0);

  if (!hasData) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-400">
        {t.admin.dashboard.revenueChart.noData}
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-40 items-end gap-[3px] sm:gap-1">
        {points.map((point) => {
          const heightPercent = Math.max(2, (point.revenue / max) * 100);
          return (
            <div
              key={point.date}
              className="group relative flex flex-1 flex-col items-center justify-end"
              title={`${formatDate(point.date, locale)}: ${formatPriceKRW(point.revenue)}`}
            >
              <div
                className={`w-full rounded-t transition-colors ${
                  point.revenue > 0 ? "bg-sky-500 group-hover:bg-sky-600" : "bg-slate-100"
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>{formatDate(points[0].date, locale)}</span>
        <span>{formatDate(points[points.length - 1].date, locale)}</span>
      </div>
    </div>
  );
}
