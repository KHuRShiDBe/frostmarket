"use client";

import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useLocale } from "@/context/LocaleContext";
import RecentlyViewedSection from "./RecentlyViewedSection";

export default function AccountRecentlyViewedContent() {
  const { recentIds } = useRecentlyViewed();
  const { t } = useLocale();

  if (recentIds.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.recentlyViewed.heading}
        </h1>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-600">{t.account.recentlyViewedEmpty}</p>
        </div>
      </div>
    );
  }

  return <RecentlyViewedSection className="" />;
}
