"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "frostmarket:recentlyViewed";
const MAX_ITEMS = 10;

interface RecentlyViewedContextValue {
  recentIds: string[];
  recordView: (id: string) => void;
  clearHistory: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  // A ref (not state) so the "have we hydrated yet" flag is visible
  // synchronously to any effect that runs afterward in the same commit —
  // including recordView calls fired by children on the very first mount,
  // which otherwise race the state-based flag during initial hydration.
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Merge rather than overwrite: a child's recordView() may already
          // have fired in this same mount (effects run bottom-up), so
          // anything already in state takes priority over stored history.
          // Syncing from localStorage (client-only) on mount; can't be a lazy
          // useState initializer without causing a hydration mismatch.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setRecentIds((prev) => {
            const merged = [...prev, ...parsed.filter((id) => !prev.includes(id))];
            return merged.slice(0, MAX_ITEMS);
          });
        }
      }
    } catch {
      // ignore malformed/inaccessible storage
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentIds));
    } catch {
      // ignore write failures
    }
  }, [recentIds]);

  const recordView = useCallback((id: string) => {
    hydratedRef.current = true;
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((existing) => existing !== id)];
      return next.slice(0, MAX_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    hydratedRef.current = true;
    setRecentIds([]);
  }, []);

  const value = useMemo(
    () => ({ recentIds, recordView, clearHistory }),
    [recentIds, recordView, clearHistory],
  );

  return (
    <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return ctx;
}
