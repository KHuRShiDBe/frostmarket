export const LOCALES = ["ko", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  ru: "RU",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
