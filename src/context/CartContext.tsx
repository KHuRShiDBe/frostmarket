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
import { getProduct } from "@/data/products";
import { useLocale } from "@/context/LocaleContext";

const STORAGE_KEY = "frostmarket:cart";
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 5;

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartNotice {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface CartContextValue {
  items: CartLine[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  totalQuantity: number;
  totalPrice: number;
  notice: CartNotice | null;
  dismissNotice: () => void;
  notify: (message: string) => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return typeof line.productId === "string" && typeof line.quantity === "number";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<CartNotice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore the cart once, on the client only.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed
            .filter(isCartLine)
            .map((line) => ({
              productId: line.productId,
              quantity: Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, line.quantity)),
            }));
          // Syncing from localStorage (client-only) on mount; SSR renders empty
          // to avoid a hydration mismatch, so this can't be a lazy useState initializer.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(valid);
        }
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }, [items, hydrated]);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  const dismissNotice = useCallback(() => {
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    setNotice(null);
  }, []);

  const showNotice = useCallback((next: CartNotice) => {
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    setNotice(next);
    noticeTimeoutRef.current = setTimeout(() => setNotice(null), 3200);
  }, []);

  const addItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const existing = prev.find((line) => line.productId === productId);
        if (existing) {
          return prev.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) }
              : line,
          );
        }
        return [...prev, { productId, quantity: 1 }];
      });
      const product = getProduct(productId);
      showNotice({ message: t.cart.addedToast(product ? product.model : productId) });
    },
    [showNotice, t],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const clamped = Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, Math.round(quantity)));
    setItems((prev) =>
      prev.map((line) => (line.productId === productId ? { ...line, quantity: clamped } : line)),
    );
  }, []);

  const clearCart = useCallback(() => {
    if (items.length === 0) return;
    const snapshot = items;
    setItems([]);
    showNotice({
      message: t.cart.clearedToast,
      actionLabel: t.cart.undoClear,
      onAction: () => setItems(snapshot),
    });
  }, [items, showNotice, t]);

  const notify = useCallback((message: string) => showNotice({ message }), [showNotice]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const idsSet = new Set(items.map((line) => line.productId));
    const totalQuantity = items.reduce((sum, line) => sum + line.quantity, 0);
    const totalPrice = items.reduce((sum, line) => {
      const product = getProduct(line.productId);
      return sum + (product ? product.price * line.quantity : 0);
    }, 0);

    return {
      items,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      isInCart: (id) => idsSet.has(id),
      totalQuantity,
      totalPrice,
      notice,
      dismissNotice,
      notify,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [
    items,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    notice,
    dismissNotice,
    notify,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
