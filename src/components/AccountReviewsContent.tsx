"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { useUserReviews } from "@/hooks/useReviews";
import StarRating from "./StarRating";
import ReviewFormModal, { type ReviewFormValues } from "./ReviewFormModal";
import { getProduct } from "@/data/products";
import { localizedBrandName } from "@/i18n";
import { formatDate } from "@/lib/date";

export default function AccountReviewsContent() {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const { reviews, updateReview, deleteReview } = useUserReviews(user?.id ?? null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  if (!user) return null;

  const editingReview = editingId ? (reviews.find((r) => r.id === editingId) ?? null) : null;
  const sortedReviews = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleEditSubmit = (values: ReviewFormValues) => {
    if (!editingReview) return { success: false as const, error: "not_found" as const };
    const result = updateReview(editingReview.id, values);
    if (result.success) setEditingId(null);
    return result;
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.account.nav.reviews}</h1>

      {sortedReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-600">{t.reviews.myReviews.empty}</p>
          <Link
            href="/#catalog"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            {t.checkout.emptyCart.cta}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {sortedReviews.map((review) => {
            const product = getProduct(review.productId);
            return (
              <div key={review.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  {product && (
                    <Image src={product.mainImage} alt={product.model} fill className="object-contain p-1.5" sizes="64px" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      {product && (
                        <p className="text-xs font-semibold text-sky-600">{localizedBrandName(product.brand, locale)}</p>
                      )}
                      <p className="truncate text-sm font-bold text-slate-900">
                        {product ? product.model : review.productId}
                      </p>
                    </div>
                    {product && (
                      <Link
                        href={`/products/${product.id}`}
                        className="shrink-0 text-xs font-medium text-sky-600 hover:text-sky-700"
                      >
                        {t.reviews.myReviews.viewProduct}
                      </Link>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating value={review.rating} size={14} />
                    <span className="text-xs text-slate-400">{formatDate(review.createdAt, locale)}</span>
                  </div>

                  {review.title && <p className="mt-2 text-sm font-bold text-slate-900">{review.title}</p>}
                  <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{review.text}</p>

                  <div className="mt-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(review.id)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-sky-600"
                    >
                      {t.reviews.editReview}
                    </button>
                    {confirmingDeleteId === review.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            deleteReview(review.id);
                            setConfirmingDeleteId(null);
                          }}
                          className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
                        >
                          {t.reviews.deleteConfirm.confirm}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDeleteId(null)}
                          className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
                        >
                          {t.reviews.deleteConfirm.cancel}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteId(review.id)}
                        className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        {t.reviews.deleteReview}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingReview && (
        <ReviewFormModal
          mode="edit"
          initialValue={{ rating: editingReview.rating, title: editingReview.title, text: editingReview.text }}
          onClose={() => setEditingId(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
