"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="text-xs uppercase tracking-wide text-sky-600">404</span>
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.notFound.title}</h1>
      <p className="max-w-sm text-sm text-slate-500">{t.notFound.body}</p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
      >
        {t.notFound.backLink}
      </Link>
    </main>
  );
}
