"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPriceKRW } from "@/lib/currency";
import CartLineRow from "./CartLineRow";

function EmptyCartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" aria-hidden>
      <path
        d="M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L19.5 8H6.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" />
      <circle cx="16.5" cy="19.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

export default function CartPageContent() {
  const { items, totalPrice, clearCart } = useCart();
  const { t } = useLocale();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
          <EmptyCartIcon />
        </span>
        <p className="text-sm font-medium text-slate-600">{t.cart.emptyTitle}</p>
        <Link
          href="/#catalog"
          className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.cart.emptyCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-14">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
          {items.map((line) => (
            <div key={line.productId} className="p-5">
              <CartLineRow productId={line.productId} quantity={line.quantity} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
          >
            ← {t.cart.continueShopping}
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-slate-400 transition-colors hover:text-rose-500 hover:underline"
          >
            {t.cart.clearCart}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:sticky lg:top-24">
        <h2 className="font-heading text-lg font-bold text-slate-900">{t.cart.orderSummary}</h2>

        <div className="mt-5 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">{t.cart.subtotal}</span>
            <span className="font-semibold text-slate-900">{formatPriceKRW(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">{t.cart.delivery}</span>
            <span className="font-semibold text-emerald-600">{t.cart.free}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="font-heading text-base font-bold text-slate-900">{t.cart.total}</span>
          <span className="font-heading text-lg font-bold text-slate-900">{formatPriceKRW(totalPrice)}</span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          {t.cart.checkout}
        </Link>
      </div>
    </div>
  );
}
