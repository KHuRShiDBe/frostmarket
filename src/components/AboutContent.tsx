"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const FEATURE_ICONS = [
  <svg key="0" viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path d="M4 10h16" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 6.5h.01M8 14h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>,
  <svg key="1" viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
    <path
      d="M11 3.5H5.5A2 2 0 0 0 3.5 5.5V11c0 .5.2 1 .6 1.4l8 8c.8.8 2 .8 2.8 0l5.5-5.5c.8-.8.8-2 0-2.8l-8-8c-.4-.4-.9-.6-1.4-.6Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="8.3" cy="8.3" r="1.3" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
    <rect x="3" y="4" width="7.5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <rect x="13.5" y="4" width="7.5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="M6.75 9.5v5M17.25 9.5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
    <path
      d="M12 20.5s-7-4.4-9.5-8.8C.9 8.7 2.3 4.5 6.3 4.5c2.2 0 3.7 1.3 5.7 3.5 2-2.2 3.5-3.5 5.7-3.5 4 0 5.4 4.2 3.8 7.2C19 16.1 12 20.5 12 20.5z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>,
];

export default function AboutContent() {
  const { t } = useLocale();

  return (
    <>
      <section className="mb-12 sm:mb-16">
        <h2 className="mb-5 text-lg font-bold text-slate-900 sm:mb-6 sm:text-xl">
          {t.about.featuresHeading}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {t.about.features.map((feature, i) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                {FEATURE_ICONS[i]}
              </span>
              <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 max-w-2xl sm:mb-16">
        <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">{t.about.goalHeading}</h2>
        <p className="text-sm leading-relaxed text-slate-500 sm:text-base">{t.about.goalBody}</p>
      </section>

      <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="text-sm font-medium text-slate-700 sm:text-base">{t.about.ctaText}</p>
        <Link
          href="/#catalog"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.about.ctaButton}
        </Link>
      </div>
    </>
  );
}
