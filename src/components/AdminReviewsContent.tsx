"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useAdminReviews, useAdminProducts } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/date";
import StarRating from "./StarRating";

const ALL = "all";

export default function AdminReviewsContent() {
  const { t, locale } = useLocale();
  const { reviews, isLoading, deleteReview } = useAdminReviews();
  const { products } = useAdminProducts();

  const [ratingFilter, setRatingFilter] = useState<string>(ALL);
  const [productFilter, setProductFilter] = useState<string>(ALL);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p] as const)), [products]);

  const reviewedProductIds = useMemo(() => Array.from(new Set(reviews.map((r) => r.productId))), [reviews]);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (ratingFilter !== ALL && review.rating !== Number(ratingFilter)) return false;
      if (productFilter !== ALL && review.productId !== productFilter) return false;
      if (verifiedOnly && !review.verifiedPurchase) return false;
      return true;
    });
  }, [reviews, ratingFilter, productFilter, verifiedOnly]);

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);
    setConfirmingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.admin.reviews.heading}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value={ALL}>{t.admin.reviews.filters.allRatings}</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n}★
            </option>
          ))}
        </select>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value={ALL}>{t.admin.reviews.filters.allProducts}</option>
          {reviewedProductIds.map((id) => (
            <option key={id} value={id}>
              {productsById.get(id)?.model ?? id}
            </option>
          ))}
        </select>

        <label className="inline-flex cursor-pointer select-none items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-3.5 w-3.5 accent-sky-600"
          />
          {t.admin.reviews.filters.verifiedOnly}
        </label>

        <span className="text-xs text-slate-400">{t.admin.reviews.resultCount(filtered.length)}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!isLoading && filtered.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-slate-400">{t.admin.reviews.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.reviews.columns.product}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.reviews.columns.user}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.reviews.columns.rating}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.reviews.columns.review}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.reviews.columns.date}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.reviews.columns.verified}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.common.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((review) => {
                  const product = productsById.get(review.productId);
                  return (
                    <tr key={review.id} className="align-top transition-colors hover:bg-slate-50">
                      <td className="max-w-[140px] px-5 py-3.5 sm:px-6">
                        {product ? (
                          <Link href={`/products/${product.id}`} className="text-sm font-semibold text-sky-600 hover:underline">
                            {product.model}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">{review.productId}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 sm:px-6">{review.userName}</td>
                      <td className="px-5 py-3.5 sm:px-6">
                        <StarRating value={review.rating} size={14} />
                      </td>
                      <td className="max-w-xs px-5 py-3.5 text-slate-600 sm:px-6">
                        {review.title && <p className="font-semibold text-slate-900">{review.title}</p>}
                        <p className="line-clamp-2">{review.text}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 sm:px-6">{formatDate(review.createdAt, locale)}</td>
                      <td className="px-5 py-3.5 sm:px-6">
                        {review.verifiedPurchase ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                            {t.reviews.verifiedPurchase}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 sm:px-6">
                        {confirmingId === review.id ? (
                          <div className="flex flex-col gap-1.5">
                            <p className="text-xs text-slate-500">{t.admin.reviews.deleteConfirmTitle}</p>
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDelete(review.id)}
                                className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
                              >
                                {t.admin.common.delete}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmingId(null)}
                                className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
                              >
                                {t.admin.common.cancel}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingId(review.id)}
                            className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          >
                            {t.admin.common.delete}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
