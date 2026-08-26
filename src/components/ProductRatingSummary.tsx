"use client";

import Link from "next/link";
import StarRating from "./StarRating";
import { useLocale } from "@/context/LocaleContext";
import type { RatingSummary } from "@/services/reviews";

/** Compact "★★★★☆ 4.6 (128 reviews)" line shown near the price on the Product Page, linking down to the full Reviews section. */
export default function ProductRatingSummary({ summary }: { summary: RatingSummary }) {
  const { t } = useLocale();

  if (summary.count === 0) {
    return (
      <Link href="#reviews" className="mt-2 inline-block text-sm text-slate-400 transition-colors hover:text-sky-600">
        {t.reviews.noReviewsYet}
      </Link>
    );
  }

  return (
    <Link href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm">
      <StarRating value={summary.average} size={16} />
      <span className="font-semibold text-slate-900">{summary.average.toFixed(1)}</span>
      <span className="text-slate-400 transition-colors hover:text-sky-600 hover:underline">
        {t.reviews.reviewCount(summary.count)}
      </span>
    </Link>
  );
}
