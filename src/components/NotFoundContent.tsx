"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

function SearchSnowflakeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M11 3v11M5.9 6.2l10.2 7.6M5.9 13.8l10.2-7.6" />
        <path d="M11 3l-1.6 2M11 3l1.6 2M11 17l-1.6-2M11 17l1.6-2" />
      </g>
      <circle cx="17" cy="17" r="4.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M20 20l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function NotFoundContent() {
  const { t } = useLocale();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_6px_rgba(2,50,90,0.35)]">
        <SearchSnowflakeIcon />
      </span>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">404</span>
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.notFound.title}</h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-500">{t.notFound.body}</p>
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          {t.notFound.homeLink}
        </Link>
        <Link
          href="/#catalog"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          {t.notFound.catalogLink}
        </Link>
      </div>
    </main>
  );
}
