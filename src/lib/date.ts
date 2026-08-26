import type { Locale } from "@/i18n";

const LOCALE_TAGS: Record<Locale, string> = { ko: "ko-KR", ru: "ru-RU", en: "en-US" };

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}
