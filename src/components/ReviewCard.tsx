"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { useLocale } from "@/context/LocaleContext";
import { formatDate } from "@/lib/date";
import type { Review } from "@/services/reviews";

function HelpfulIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M7 11v9M3 13v5a2 2 0 0 0 2 2h9.3a2 2 0 0 0 2-1.6l1.3-6.4a2 2 0 0 0-2-2.4H12l.7-4A2 2 0 0 0 10.8 3L7 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReviewCard({
  review,
  isOwn,
  hasVotedHelpful,
  canVoteHelpful,
  onToggleHelpful,
  onEdit,
  onDelete,
}: {
  review: Review;
  isOwn: boolean;
  hasVotedHelpful: boolean;
  canVoteHelpful: boolean;
  onToggleHelpful: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t, locale } = useLocale();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <article className="flex flex-col gap-3 border-b border-slate-100 py-6 first:pt-0 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-600">
            {review.userName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-bold text-slate-900">{review.userName}</p>
              {isOwn && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {t.reviews.yourReviewBadge}
                </span>
              )}
              {review.verifiedPurchase && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  {t.reviews.verifiedPurchase}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <StarRating value={review.rating} size={14} />
              <span className="text-xs text-slate-400">{formatDate(review.createdAt, locale)}</span>
            </div>
          </div>
        </div>

        {isOwn && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-sky-600"
            >
              {t.reviews.editReview}
            </button>
            {!confirmingDelete ? (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                {t.reviews.deleteReview}
              </button>
            ) : (
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingDelete(false);
                    onDelete();
                  }}
                  className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-rose-600"
                >
                  {t.reviews.deleteConfirm.confirm}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
                >
                  {t.reviews.deleteConfirm.cancel}
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {review.title && <p className="text-sm font-bold text-slate-900">{review.title}</p>}
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{review.text}</p>

      <button
        type="button"
        onClick={onToggleHelpful}
        disabled={!canVoteHelpful}
        aria-pressed={hasVotedHelpful}
        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          hasVotedHelpful
            ? "border-sky-200 bg-sky-50 text-sky-700"
            : "border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600"
        } ${!canVoteHelpful ? "cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-slate-500" : ""}`}
      >
        <HelpfulIcon />
        {t.reviews.helpful}
        {review.helpfulCount > 0 && <span>({review.helpfulCount})</span>}
      </button>
    </article>
  );
}
