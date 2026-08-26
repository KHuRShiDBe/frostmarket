"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import StarRating from "./StarRating";
import RatingDistribution from "./RatingDistribution";
import ReviewCard from "./ReviewCard";
import ReviewFormModal, { type ReviewFormValues } from "./ReviewFormModal";
import type { RatingSummary, Review, ReviewInput, ReviewResult, ReviewSortOption, ReviewUpdateInput } from "@/services/reviews";
import type { User } from "@/services/auth";

const SORT_OPTIONS: ReviewSortOption[] = ["newest", "oldest", "highest", "lowest", "helpful"];

function sortReviews(list: Review[], sort: ReviewSortOption): Review[] {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "oldest":
      sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    case "highest":
      sorted.sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt));
      break;
    case "lowest":
      sorted.sort((a, b) => a.rating - b.rating || b.createdAt.localeCompare(a.createdAt));
      break;
    case "helpful":
      sorted.sort((a, b) => b.helpfulCount - a.helpfulCount || b.createdAt.localeCompare(a.createdAt));
      break;
  }
  return sorted;
}

export default function ReviewsSection({
  currentUser,
  reviews,
  summary,
  ownReview,
  createReview,
  updateReview,
  deleteReview,
  toggleHelpful,
}: {
  currentUser: User | null;
  reviews: Review[];
  summary: RatingSummary;
  ownReview: Review | null;
  createReview: (input: Omit<ReviewInput, "productId">) => ReviewResult;
  updateReview: (reviewId: string, updates: ReviewUpdateInput) => ReviewResult;
  deleteReview: (reviewId: string) => boolean;
  toggleHelpful: (reviewId: string) => void;
}) {
  const { t } = useLocale();
  const pathname = usePathname();

  const [sort, setSort] = useState<ReviewSortOption>("newest");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [formOpen, setFormOpen] = useState<null | "create" | "edit">(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      if (ratingFilter !== 0 && Math.round(review.rating) !== ratingFilter) return false;
      if (verifiedOnly && !review.verifiedPurchase) return false;
      return true;
    });
  }, [reviews, ratingFilter, verifiedOnly]);

  const sorted = useMemo(() => sortReviews(filtered, sort), [filtered, sort]);

  const resetFilters = () => {
    setRatingFilter(0);
    setVerifiedOnly(false);
  };

  const sortLabel = (option: ReviewSortOption): string => {
    switch (option) {
      case "newest":
        return t.reviews.sort.newest;
      case "oldest":
        return t.reviews.sort.oldest;
      case "highest":
        return t.reviews.sort.highest;
      case "lowest":
        return t.reviews.sort.lowest;
      case "helpful":
        return t.reviews.sort.mostHelpful;
    }
  };

  const loginHref = `/login?redirect=${encodeURIComponent(`${pathname}#reviews`)}`;

  const handleCreateSubmit = (values: ReviewFormValues) => {
    if (!currentUser) return { success: false as const, error: "not_authenticated" as const };
    const result = createReview({
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      ...values,
    });
    if (result.success) setSuccessMessage(t.reviews.form.successCreate);
    return result;
  };

  const handleEditSubmit = (values: ReviewFormValues) => {
    if (!ownReview) return { success: false as const, error: "not_found" as const };
    const result = updateReview(ownReview.id, values);
    if (result.success) setSuccessMessage(t.reviews.form.successUpdate);
    return result;
  };

  const handleDelete = (reviewId: string) => {
    if (deleteReview(reviewId)) setSuccessMessage(t.reviews.deleteConfirm.success);
  };

  const filterPills = [
    { key: 0, label: t.reviews.filters.all },
    ...([5, 4, 3, 2, 1] as const).map((n) => ({ key: n, label: t.reviews.filters.starsOption(n) })),
  ];

  return (
    <section id="reviews" className="mt-16 scroll-mt-24 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
      <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">{t.reviews.ratingWord}</span>
      <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">{t.reviews.heading}</h2>

      {successMessage && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">{successMessage}</p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            {summary.count === 0 ? (
              <p className="text-sm text-slate-400">{t.reviews.noReviewsYet}</p>
            ) : (
              <>
                <p className="font-heading text-4xl font-bold text-slate-900">{summary.average.toFixed(1)}</p>
                <div className="mt-2">
                  <StarRating value={summary.average} size={18} />
                </div>
                <p className="mt-1 text-sm text-slate-400">{t.reviews.reviewCount(summary.count)}</p>
                <div className="mt-5">
                  <RatingDistribution summary={summary} activeFilter={ratingFilter} onSelect={setRatingFilter} />
                </div>
              </>
            )}
          </div>

          {currentUser ? (
            !ownReview && (
              <button
                type="button"
                onClick={() => setFormOpen("create")}
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
              >
                {t.reviews.writeReview}
              </button>
            )
          ) : (
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
            >
              {t.reviews.writeReviewSignedOut}
            </Link>
          )}
        </div>

        <div className="min-w-0">
          {summary.count > 0 && (
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {filterPills.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRatingFilter(opt.key)}
                    aria-pressed={ratingFilter === opt.key}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      ratingFilter === opt.key
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setVerifiedOnly((v) => !v)}
                  aria-pressed={verifiedOnly}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    verifiedOnly
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  {t.reviews.filters.verifiedOnly}
                </button>
              </div>

              <label className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                <span>{t.reviews.sort.label}</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as ReviewSortOption)}
                  aria-label={t.reviews.sort.label}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {sortLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {summary.count > 0 && (
            <p className="mt-3 text-xs text-slate-400">{t.reviews.filters.resultCount(sorted.length)}</p>
          )}

          {sorted.length === 0 ? (
            summary.count === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                <p className="text-sm font-medium text-slate-600">{t.reviews.noReviewsYet}</p>
                <p className="mt-1.5 text-sm text-slate-400">{t.reviews.noReviewsBody}</p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 py-14 text-center">
                <p className="text-sm font-medium text-slate-600">{t.reviews.filters.emptyTitle}</p>
                <p className="mt-1.5 text-sm text-slate-400">{t.reviews.filters.emptyDescription}</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm font-medium text-sky-600 hover:text-sky-700"
                >
                  {t.reviews.filters.reset}
                </button>
              </div>
            )
          ) : (
            <div className="mt-2 flex flex-col">
              {sorted.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isOwn={currentUser?.id === review.userId}
                  hasVotedHelpful={!!currentUser && review.helpfulUserIds.includes(currentUser.id)}
                  canVoteHelpful={!!currentUser && currentUser.id !== review.userId}
                  onToggleHelpful={() => toggleHelpful(review.id)}
                  onEdit={() => setFormOpen("edit")}
                  onDelete={() => handleDelete(review.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {formOpen === "create" && (
        <ReviewFormModal mode="create" onClose={() => setFormOpen(null)} onSubmit={handleCreateSubmit} />
      )}
      {formOpen === "edit" && ownReview && (
        <ReviewFormModal
          mode="edit"
          initialValue={{ rating: ownReview.rating, title: ownReview.title, text: ownReview.text }}
          onClose={() => setFormOpen(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </section>
  );
}
