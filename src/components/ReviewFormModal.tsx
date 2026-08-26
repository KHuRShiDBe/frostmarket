"use client";

import { useEffect, useState, type FormEvent } from "react";
import StarRating from "./StarRating";
import { useLocale } from "@/context/LocaleContext";
import type { ReviewErrorCode } from "@/services/reviews";

export interface ReviewFormValues {
  rating: number;
  title: string;
  text: string;
}

export type ReviewSubmitResult = { success: true } | { success: false; error: ReviewErrorCode };

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function ReviewFormModal({
  mode,
  initialValue,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  initialValue?: ReviewFormValues;
  onClose: () => void;
  onSubmit: (values: ReviewFormValues) => ReviewSubmitResult;
}) {
  const { t } = useLocale();
  const [rating, setRating] = useState(initialValue?.rating ?? 0);
  const [title, setTitle] = useState(initialValue?.title ?? "");
  const [text, setText] = useState(initialValue?.text ?? "");
  const [errors, setErrors] = useState<{ rating?: string; text?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) nextErrors.rating = t.reviews.form.ratingRequired;
    if (!text.trim()) nextErrors.text = t.reviews.form.textRequired;
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    const result = onSubmit({ rating, title: title.trim(), text: text.trim() });
    if (!result.success) {
      setFormError(t.reviews.errors[result.error]);
      return;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-form-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="review-form-title" className="font-heading text-lg font-bold text-slate-900">
            {mode === "create" ? t.reviews.form.createTitle : t.reviews.form.editTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          {formError && (
            <p className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600">{formError}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t.reviews.form.ratingLabel} *</label>
            <StarRating
              interactive
              value={rating}
              onChange={(next) => {
                setRating(next);
                setErrors((prev) => ({ ...prev, rating: undefined }));
              }}
              size={28}
              ariaLabel={t.reviews.form.ratingLabel}
              getStarAriaLabel={t.reviews.form.ratingAria}
            />
            {errors.rating && <p className="text-xs text-rose-500">{errors.rating}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t.reviews.form.titleLabel}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.reviews.form.titlePlaceholder}
              maxLength={80}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t.reviews.form.textLabel} *</label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setErrors((prev) => ({ ...prev, text: undefined }));
              }}
              placeholder={t.reviews.form.textPlaceholder}
              rows={4}
              maxLength={2000}
              className={`rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 ${
                errors.text ? "border-rose-300" : "border-slate-200"
              }`}
            />
            {errors.text && <p className="text-xs text-rose-500">{errors.text}</p>}
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
            >
              {t.reviews.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
            >
              {mode === "create" ? t.reviews.form.submitCreate : t.reviews.form.submitEdit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
