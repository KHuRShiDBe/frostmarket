"use client";

import Image from "next/image";
import Link from "next/link";
import { SPEC_PENDING, type Product } from "@/data/products";
import { localizedBrandName, translateSpecValue } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { useProductReviews } from "@/hooks/useReviews";
import { formatPriceKRW } from "@/lib/currency";
import { describeMatchReason, explainMatch, type ScoredProduct, type FinderAnswers } from "@/lib/finder";
import StarRating from "./StarRating";
import AddToCartButton from "./AddToCartButton";
import FavoriteToggle from "./FavoriteToggle";
import CompareToggle from "./CompareToggle";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" aria-hidden>
      <path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" aria-hidden>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function FinderResultCard({
  product,
  scored,
  answers,
  variant = "compact",
}: {
  product: Product;
  scored: ScoredProduct;
  answers: FinderAnswers;
  variant?: "hero" | "compact";
}) {
  const { t, locale } = useLocale();
  const { user } = useAuth();
  const { summary } = useProductReviews(product.id, user?.id ?? null);
  const explanation = explainMatch(product, answers, scored);

  const brandDisplay = localizedBrandName(product.brand, locale);
  const brandPending = product.brand === SPEC_PENDING;
  const isHero = variant === "hero";

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        isHero ? "border-sky-200 lg:flex-row" : "border-slate-200"
      }`}
    >
      <div className={`relative shrink-0 bg-white ${isHero ? "aspect-square sm:aspect-[4/3] lg:w-2/5" : "aspect-square"}`}>
        <Image
          src={product.mainImage}
          alt={product.model}
          fill
          className="object-contain p-6"
          sizes={isHero ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
            scored.failedAnyHardRequirement
              ? "bg-amber-100 text-amber-700"
              : "bg-sky-600 text-white"
          }`}
        >
          {t.finder.results.matchBadge(scored.matchPercent)}
        </span>
        {isHero && (
          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-sky-700 shadow-sm">
            {t.finder.results.bestMatchBadge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wide ${brandPending ? "italic text-slate-400" : "text-sky-600"}`}>
              {brandDisplay}
            </span>
          </div>
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 className={`mt-1 font-heading font-bold text-slate-900 ${isHero ? "text-2xl sm:text-3xl" : "text-lg"}`}>
              {product.model}
            </h3>
          </Link>
          <p className={`mt-1 font-heading font-bold text-slate-900 ${isHero ? "text-xl" : "text-base"}`}>
            {formatPriceKRW(product.price)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {t.finder.results.capacityLabel}: {translateSpecValue(product.totalCapacity, locale)}
          </p>

          <Link href={`/products/${product.id}#reviews`} className="mt-2 inline-flex items-center gap-2 text-sm">
            {summary.count > 0 ? (
              <>
                <StarRating value={summary.average} size={14} />
                <span className="text-slate-400 hover:text-sky-600 hover:underline">
                  {t.reviews.reviewCount(summary.count)}
                </span>
              </>
            ) : (
              <span className="text-slate-400 hover:text-sky-600 hover:underline">{t.reviews.noReviewsYet}</span>
            )}
          </Link>
        </div>

        {explanation.pros.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.finder.results.whyItMatches}</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {explanation.pros.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                  <CheckIcon />
                  {describeMatchReason(reason, t)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {explanation.cons.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t.finder.results.tradeOffs}</p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {explanation.cons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-slate-500">
                  <MinusIcon />
                  {describeMatchReason(reason, t)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Link
            href={`/products/${product.id}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 sm:flex-none"
          >
            {t.reviews.myReviews.viewProduct}
          </Link>
          <AddToCartButton
            productId={product.id}
            model={product.model}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 sm:flex-none"
          />
          <FavoriteToggle productId={product.id} model={product.model} variant="pill" />
          <CompareToggle productId={product.id} model={product.model} variant="pill" />
        </div>
      </div>
    </div>
  );
}
