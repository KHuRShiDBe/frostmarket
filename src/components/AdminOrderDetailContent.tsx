"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { OrderStatus } from "@/services/orders";
import { useLocale } from "@/context/LocaleContext";
import { useAdminOrder } from "@/hooks/useAdmin";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { PaymentStatusBadge, OrderStatusBadge } from "./AdminStatusBadges";

const STATUS_OPTIONS: OrderStatus[] = ["processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailContent({ orderNumber }: { orderNumber: string }) {
  const { t, locale } = useLocale();
  const { order, isLoading, updateOrderStatus } = useAdminOrder(orderNumber);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [successMessage]);

  if (isLoading) return null;

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm font-medium text-slate-600">{t.account.orders.notFoundTitle}</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.admin.orders.detail.backToOrders}
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: OrderStatus) => {
    if (status === order.orderStatus) return;
    updateOrderStatus(status);
    setSuccessMessage(t.admin.orders.detail.statusUpdated);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
          >
            {t.admin.orders.detail.backToOrders}
          </Link>
          <h1 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">{order.orderNumber}</h1>
          <p className="text-sm text-slate-400">
            {t.admin.orders.detail.createdDate}: {formatDate(order.createdAt, locale)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.orderStatus} />
        </div>
      </div>

      {successMessage && (
        <p className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">{successMessage}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.orders.detail.products}</h2>
            <div className="mt-4 flex flex-col divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image src={item.image} alt={item.model} fill className="object-contain p-1.5" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-sky-600">{item.brand}</p>
                    <p className="truncate text-sm font-bold text-slate-900">{item.model}</p>
                    <p className="text-xs text-slate-400">
                      {t.admin.orders.detail.quantity}: {item.quantity} · {t.admin.orders.detail.unitPrice}:{" "}
                      {formatPriceKRW(item.unitPrice)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-slate-900">{formatPriceKRW(item.lineTotal)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.orders.detail.updateStatus}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  aria-pressed={order.orderStatus === status}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    order.orderStatus === status
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {t.account.orders.orderStatusValues[status]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm font-bold text-slate-900">{t.admin.orders.detail.customerInfo}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-sm text-slate-600">{order.customer.email}</p>
            <p className="text-sm text-slate-600">{order.customer.phone}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm font-bold text-slate-900">{t.admin.orders.detail.shippingAddress}</h3>
            <p className="mt-2 text-sm text-slate-600">
              {order.customer.city}, {order.customer.address}
              {order.customer.apartment ? `, ${order.customer.apartment}` : ""}
            </p>
            {order.customer.postalCode && <p className="text-sm text-slate-600">{order.customer.postalCode}</p>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{t.admin.orders.detail.subtotal}</span>
              <span className="font-semibold text-slate-900">{formatPriceKRW(order.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">{t.admin.orders.detail.delivery}</span>
              <span className="font-semibold text-slate-900">
                {order.deliveryCost === 0 ? t.cart.free : formatPriceKRW(order.deliveryCost)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-heading text-base font-bold text-slate-900">{t.admin.orders.detail.total}</span>
              <span className="font-heading text-lg font-bold text-slate-900">{formatPriceKRW(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
