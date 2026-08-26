"use client";

import { LOCALES, LOCALE_LABELS } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t.header.languageLabel}
      className={`inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-1 shadow-sm ${className ?? ""}`}
    >
      {LOCALES.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              active ? "bg-sky-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {LOCALE_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
