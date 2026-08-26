"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { getOrderRepository, type Order } from "@/services/orders";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";

export default function AccountOrderDetailContent({ orderNumber }: { orderNumber: string }) {
  const { user } = useAuth();
  const { t, locale } = useLocale();

  if (!user) return null;

  const order = getOrderRepository().getByOrderNumber(orderNumber);
  const owned = order && order.userId === user.id ? order : null;

  if (!owned) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm font-medium text-slate-600">{t.account.orders.notFoundTitle}</p>
        <p className="mt-1.5 text-sm text-slate-400">{t.account.orders.notFoundBody}</p>
        <Link
          href="/account/orders"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.account.orders.backToOrders}
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/account/orders"
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
          >
            ← {t.account.orders.backToOrders}
          </Link>
          <h1 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">{owned.orderNumber}</h1>
          <p className="text-sm text-slate-400">{formatDate(owned.createdAt, locale)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
            {t.account.orders.paymentStatusValues[owned.paymentStatus]}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {t.account.orders.orderStatusValues[owned.orderStatus]}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-base font-bold text-slate-900">
            {t.checkout.success.purchasedProducts}
          </h2>
          <div className="flex flex-col divide-y divide-slate-100">
            {owned.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <Image src={item.image} alt={item.model} fill className="object-contain p-1.5" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-sky-600">{item.brand}</p>
                  <p className="truncate text-sm font-bold text-slate-900">{item.model}</p>
                  <p className="text-xs text-slate-400">
                    {t.cart.quantity}: {item.quantity} · {t.cart.unitPrice}: {formatPriceKRW(item.unitPrice)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-slate-900">{formatPriceKRW(item.lineTotal)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm font-bold text-slate-900">{t.checkout.info.heading}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {owned.customer.firstName} {owned.customer.lastName}
            </p>
            <p className="text-sm text-slate-600">{owned.customer.email}</p>
            <p className="text-sm text-slate-600">{owned.customer.phone}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm font-bold text-slate-900">{t.account.orders.deliveryInfo}</h3>
            <p className="mt-2 text-sm text-slate-600">{deliveryLabel[owned.deliveryMethod]}</p>
            <p className="text-sm text-slate-600">
              {owned.customer.city}, {owned.customer.address}
              {owned.customer.apartment ? `, ${owned.customer.apartment}` : ""}
            </p>
            {owned.customer.postalCode && <p className="text-sm text-slate-600">{owned.customer.postalCode}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{t.cart.subtotal}</span>
              <span className="font-semibold text-slate-900">{formatPriceKRW(owned.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">{t.cart.delivery}</span>
              <span className="font-semibold text-slate-900">
                {owned.deliveryCost === 0 ? t.cart.free : formatPriceKRW(owned.deliveryCost)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-heading text-base font-bold text-slate-900">{t.cart.total}</span>
              <span className="font-heading text-lg font-bold text-slate-900">{formatPriceKRW(owned.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
