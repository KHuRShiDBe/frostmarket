"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

type PageKey = "favorites" | "compare" | "about" | "faq" | "inquiry" | "cart";

export default function PageIntro({
  page,
  wrapperClassName = "mb-8 flex flex-col gap-1.5 sm:mb-12",
}: {
  page: PageKey;
  wrapperClassName?: string;
}) {
  const { t } = useLocale();
  const entry = t.pages[page];
  const description = "description" in entry ? entry.description : null;

  return (
    <>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
      >
        {t.common.backHome}
      </Link>

      <div className={wrapperClassName}>
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          {entry.eyebrow}
        </span>
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{entry.title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </>
  );
}
