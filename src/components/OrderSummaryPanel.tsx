"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { getProductService } from "@/services/products";
import { formatPriceKRW } from "@/lib/currency";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OrderSummaryPanel({ deliveryCost = 0 }: { deliveryCost?: number }) {
  const { items, totalPrice } = useCart();
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const total = totalPrice + deliveryCost;

  const lines = (
    <div className="flex flex-col gap-4">
      {items.map((line) => {
        const product = getProductService().getProduct(line.productId);
        if (!product) return null;
        return (
          <div key={line.productId} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image src={product.mainImage} alt={product.model} fill className="object-contain p-1" sizes="56px" />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                {line.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{product.model}</p>
              <p className="text-xs text-slate-400">{formatPriceKRW(product.price)}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-slate-900">
              {formatPriceKRW(product.price * line.quantity)}
            </p>
          </div>
        );
      })}
    </div>
  );

  const totals = (
    <div className="flex flex-col gap-2.5 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-slate-500">{t.cart.subtotal}</span>
        <span className="font-semibold text-slate-900">{formatPriceKRW(totalPrice)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-slate-500">{t.cart.delivery}</span>
        <span className="font-semibold text-slate-900">
          {deliveryCost === 0 ? t.cart.free : formatPriceKRW(deliveryCost)}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="font-heading text-base font-bold text-slate-900">{t.cart.total}</span>
        <span className="font-heading text-lg font-bold text-slate-900">{formatPriceKRW(total)}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet: always-visible sidebar */}
      <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24 lg:block">
        <h2 className="font-heading text-lg font-bold text-slate-900">{t.checkout.summary.heading}</h2>
        <div className="mt-5">{lines}</div>
        <div className="mt-5 border-t border-slate-200 pt-4">{totals}</div>
      </div>

      {/* Mobile: collapsible summary */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 lg:hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex w-full items-center justify-between gap-3 px-5 py-4"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            {expanded ? t.checkout.summary.hideDetails : t.checkout.summary.showDetails}
            <ChevronIcon open={expanded} />
          </span>
          <span className="font-heading text-base font-bold text-slate-900">{formatPriceKRW(total)}</span>
        </button>
        {expanded && (
          <div className="border-t border-slate-200 px-5 py-4">
            <div className="mb-4">{lines}</div>
            {totals}
          </div>
        )}
      </div>
    </>
  );
}
