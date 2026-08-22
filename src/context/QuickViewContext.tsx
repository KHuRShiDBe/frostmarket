"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface QuickViewContextValue {
  productId: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [productId, setProductId] = useState<string | null>(null);

  const openQuickView = useCallback((id: string) => setProductId(id), []);
  const closeQuickView = useCallback(() => setProductId(null), []);

  const value = useMemo(
    () => ({ productId, openQuickView, closeQuickView }),
    [productId, openQuickView, closeQuickView],
  );

  return (
    <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return ctx;
}
