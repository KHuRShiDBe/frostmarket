"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_LOCALE, isLocale, translations, type Locale, type TranslationDict } from "@/i18n";

const STORAGE_KEY = "frostmarket:locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  // Restore a previously chosen language once, on the client only.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw && isLocale(raw)) {
        // Syncing from localStorage (client-only) on mount; SSR renders the
        // default locale to avoid a hydration mismatch, so this can't be a
        // lazy useState initializer.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(raw);
      }
    } catch {
      // ignore malformed/inaccessible storage
    }
    setHydrated(true);
  }, []);

  // Persist after the initial load, so we never overwrite a stored choice
  // with the default locale before hydration has run.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
    document.documentElement.lang = locale;
  }, [locale, hydrated]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: translations[locale] }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
