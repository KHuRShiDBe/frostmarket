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

export const MAX_COMPARE = 4;
export const MIN_COMPARE = 2;

const STORAGE_KEY = "frostmarket:compare";

interface CompareContextValue {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  isFull: boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously saved comparison selection once, on the client only.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Syncing from localStorage (client-only) on mount; SSR renders empty
        // to avoid a hydration mismatch, so this can't be a lazy useState initializer.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setSelectedIds(parsed.slice(0, MAX_COMPARE));
      }
    } catch {
      // ignore malformed/inaccessible storage
    }
    setHydrated(true);
  }, []);

  // Persist after the initial load, so we never overwrite stored data with
  // the empty initial state before hydration has run.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [selectedIds, hydrated]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((existing) => existing !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((existing) => existing !== id));
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const value = useMemo<CompareContextValue>(() => {
    const idsSet = new Set(selectedIds);
    return {
      selectedIds,
      isSelected: (id) => idsSet.has(id),
      isFull: selectedIds.length >= MAX_COMPARE,
      toggle,
      remove,
      clear,
    };
  }, [selectedIds, toggle, remove, clear]);

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
