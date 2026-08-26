"use client";

import RecentlyViewedCard from "./RecentlyViewedCard";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import type { Product } from "@/data/products";
import { getProductService } from "@/services/products";
import { useLocale } from "@/context/LocaleContext";

export default function RecentlyViewedSection({
  currentProductId,
  className = "mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12",
}: {
  currentProductId?: string;
  className?: string;
}) {
  const { recentIds, clearHistory } = useRecentlyViewed();
  const { t } = useLocale();

  const items = recentIds
    .filter((id) => id !== currentProductId)
    .map((id) => getProductService().getProduct(id))
    .filter((p): p is Product => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {t.recentlyViewed.heading}
          </span>
          <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t.recentlyViewed.heading}
          </h2>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="text-sm text-slate-400 transition-colors hover:text-rose-500 hover:underline"
        >
          {t.recentlyViewed.clearHistory}
        </button>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 sm:gap-5">
        {items.map((product) => (
          <RecentlyViewedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
