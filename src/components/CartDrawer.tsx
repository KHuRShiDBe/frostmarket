"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPriceKRW } from "@/lib/currency";
import CartLineRow from "./CartLineRow";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EmptyCartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden>
      <path
        d="M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L19.5 8H6.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
      <circle cx="16.5" cy="19.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export default function CartDrawer() {
  const { items, totalPrice, isDrawerOpen, closeDrawer } = useCart();
  const { t } = useLocale();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-[70] flex justify-end transition-colors duration-300 ${
        isDrawerOpen ? "bg-slate-900/40 backdrop-blur-sm" : "pointer-events-none bg-transparent"
      }`}
      onClick={closeDrawer}
      aria-hidden={!isDrawerOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.cart.title}
        onClick={(e) => e.stopPropagation()}
        className={`flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-heading text-base font-bold text-slate-900">
            {t.cart.title}
            {items.length > 0 && <span className="ml-1.5 text-sm font-normal text-slate-400">({t.cart.itemCount(items.length)})</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={t.common.close}
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
              <EmptyCartIcon />
            </span>
            <p className="text-sm font-medium text-slate-600">{t.cart.emptyTitle}</p>
            <Link
              href="/#catalog"
              onClick={closeDrawer}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
            >
              {t.cart.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-col gap-5">
                {items.map((line) => (
                  <CartLineRow
                    key={line.productId}
                    productId={line.productId}
                    quantity={line.quantity}
                    compact
                    onNavigate={closeDrawer}
                  />
                ))}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{t.cart.subtotal}</span>
                <span className="font-bold text-slate-900">{formatPriceKRW(totalPrice)}</span>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
                >
                  {t.cart.viewCart}
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
                >
                  {t.cart.checkout}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
