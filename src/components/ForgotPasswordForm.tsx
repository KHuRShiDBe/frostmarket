"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="m5 12.5 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const fieldInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

export default function ForgotPasswordForm() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Demo-only: no email is ever sent. A real implementation would call an
    // AuthService.requestPasswordReset(email)-style method backed by a real
    // provider, kept behind the same seam as the rest of ./services/auth.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-8 text-center sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
          <CheckIcon />
        </span>
        <h1 className="font-heading text-lg font-bold text-slate-900">
          {t.auth.forgotPassword.successTitle}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-slate-500">
          {t.auth.forgotPassword.successBody}
        </p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.auth.forgotPassword.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h1 className="font-heading text-xl font-bold text-slate-900">{t.auth.forgotPassword.title}</h1>
      <p className="text-sm leading-relaxed text-slate-500">{t.auth.forgotPassword.description}</p>
      <p className="rounded-lg bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-700">
        {t.auth.forgotPassword.demoNotice}
      </p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="forgot-password-email" className="text-sm font-medium text-slate-700">
          {t.auth.fields.email}
        </label>
        <input
          id="forgot-password-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.auth.fields.emailPlaceholder}
          className={fieldInputClass}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
      >
        {t.auth.forgotPassword.submit}
      </button>

      <p className="text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
          {t.auth.forgotPassword.backToLogin}
        </Link>
      </p>
    </form>
  );
}
