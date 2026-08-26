"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getProduct, SPEC_PENDING } from "@/data/products";
import { localizedBrandName } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";

const fieldLabelClass = "text-sm font-medium text-slate-700";
const fieldInputClass =
  "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12.3 2.4 2.4 4.6-4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InquiryForm() {
  const { locale, t } = useLocale();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [interest, setInterest] = useState("");
  const [inquiryType, setInquiryType] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const modelId = new URLSearchParams(window.location.search).get("model");
    if (!modelId) return;
    const product = getProduct(modelId);
    if (!product) return;

    const brand = localizedBrandName(product.brand, locale);
    // Reading window.location (client-only) on mount to prefill from a
    // product-detail link; can't be a lazy useState initializer since this
    // is a static page with no server-side query param to read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInterest(product.brand === SPEC_PENDING ? product.model : `${brand} ${product.model}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setContact("");
    setInterest("");
    setInquiryType(0);
    setMessage("");
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-8 text-center sm:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
          <CheckIcon />
        </span>
        <h2 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
          {t.inquiry.submittedTitle}
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-slate-500">{t.inquiry.submittedBody}</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
          >
            {t.inquiry.tryAgain}
          </button>
          <Link
            href="/#catalog"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            {t.inquiry.viewCatalog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-name" className={fieldLabelClass}>
          {t.inquiry.nameLabel} <span className="text-rose-500">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.inquiry.namePlaceholder}
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-contact" className={fieldLabelClass}>
          {t.inquiry.contactLabel} <span className="text-rose-500">*</span>
        </label>
        <input
          id="inquiry-contact"
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t.inquiry.contactPlaceholder}
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-interest" className={fieldLabelClass}>
          {t.inquiry.interestLabel}
        </label>
        <input
          id="inquiry-interest"
          type="text"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder={t.inquiry.interestPlaceholder}
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-type" className={fieldLabelClass}>
          {t.inquiry.typeLabel} <span className="text-rose-500">*</span>
        </label>
        <select
          id="inquiry-type"
          required
          value={inquiryType}
          onChange={(e) => setInquiryType(Number(e.target.value))}
          className={`${fieldInputClass} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        >
          {t.inquiry.types.map((type, i) => (
            <option key={type} value={i}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-message" className={fieldLabelClass}>
          {t.inquiry.messageLabel} <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.inquiry.messagePlaceholder}
          className={`${fieldInputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        {t.inquiry.submit}
      </button>
    </form>
  );
}
