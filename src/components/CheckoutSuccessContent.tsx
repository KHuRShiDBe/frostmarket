"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { getOrderRepository, type Order } from "@/services/orders";
import { formatPriceKRW } from "@/lib/currency";
import CheckoutStepper from "./CheckoutStepper";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CheckoutSuccessContent() {
  const { t } = useLocale();
  const [order, setOrder] = useState<Order | null>(null);
  const [checked, setChecked] = useState(false);

  // Reading window.location (client-only) on mount, mirroring the pattern used
  // by ProductCatalog, rather than useSearchParams — keeps this page free of a
  // Suspense boundary and consistent with the rest of the app. Orders only
  // ever live in localStorage, so this lookup can't happen on the server anyway.
  useEffect(() => {
    const orderNumber = new URLSearchParams(window.location.search).get("order");
    const found = orderNumber ? getOrderRepository().getByOrderNumber(orderNumber) : null;
    // Syncing from localStorage (client-only) on mount; SSR renders null to
    // avoid a hydration mismatch, so this can't be a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(found);
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <p className="text-sm font-medium text-slate-600">{t.checkout.success.notFoundTitle}</p>
        <p className="mt-1.5 text-sm text-slate-400">{t.checkout.success.notFoundBody}</p>
        <Link
          href="/cart"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.checkout.success.notFoundCta}
        </Link>
      </div>
    );
  }

  const deliveryLabel: Record<Order["deliveryMethod"], string> = {
    standard: t.checkout.delivery.standardName,
    express: t.checkout.delivery.expressName,
    pickup: t.checkout.delivery.pickupName,
  };

  return (
    <div className="flex flex-col gap-8">
      <CheckoutStepper current="complete" />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
          <CheckIcon />
        </span>
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.checkout.success.heading}</h1>
        <p className="max-w-sm text-sm text-slate-500">{t.checkout.success.subheading}</p>
        <p className="mt-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
          {t.checkout.success.orderNumberLabel}: {order.orderNumber}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-12">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-base font-bold text-slate-900">
            {t.checkout.success.purchasedProducts}
          </h2>
          <div className="flex flex-col divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <Image src={item.image} alt={item.model} fill className="object-contain p-1" sizes="56px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-sky-600">{item.brand}</p>
                  <p className="truncate text-sm font-bold text-slate-900">{item.model}</p>
                  <p className="text-xs text-slate-400">
                    {t.cart.quantity}: {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-slate-900">{formatPriceKRW(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-sm">
            <span className="text-slate-500">{t.cart.total}</span>
            <span className="font-heading text-lg font-bold text-slate-900">{formatPriceKRW(order.total)}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t.checkout.success.deliveryMethodLabel}</p>
            <p className="text-sm font-semibold text-slate-900">{deliveryLabel[order.deliveryMethod]}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t.checkout.success.addressLabel}</p>
            <p className="text-sm font-semibold text-slate-900">
              {order.customer.city}, {order.customer.address}
              {order.customer.apartment ? `, ${order.customer.apartment}` : ""}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t.checkout.success.emailLabel}</p>
            <p className="text-sm font-semibold text-slate-900">{order.customer.email}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/#catalog"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
        >
          {t.checkout.success.continueShopping}
        </Link>
      </div>
    </div>
  );
}
