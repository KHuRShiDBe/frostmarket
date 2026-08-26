"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useAdminCustomer } from "@/hooks/useAdmin";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { PaymentStatusBadge, OrderStatusBadge } from "./AdminStatusBadges";

export default function AdminCustomerDetailContent({ userId }: { userId: string }) {
  const { t, locale } = useLocale();
  const { user, orders, totalSpent, reviewsCount, isLoading } = useAdminCustomer(userId);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm font-medium text-slate-600">{t.admin.customers.empty}</p>
        <Link
          href="/admin/customers"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.admin.customers.detail.backToCustomers}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/customers"
          className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          {t.admin.customers.detail.backToCustomers}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            {user.firstName} {user.lastName}
          </h1>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              user.role === "admin" ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-500"
            }`}
          >
            {t.admin.customers.roleValues[user.role]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t.admin.customers.detail.orders}
          </p>
          <p className="mt-2 font-heading text-xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t.admin.customers.detail.totalSpent}
          </p>
          <p className="mt-2 font-heading text-xl font-bold text-slate-900">{formatPriceKRW(totalSpent)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t.admin.customers.detail.reviewsCount}
          </p>
          <p className="mt-2 font-heading text-xl font-bold text-slate-900">{reviewsCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t.admin.customers.detail.registeredDate}
          </p>
          <p className="mt-2 font-heading text-xl font-bold text-slate-900">{formatDate(user.createdAt, locale)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-sm font-bold text-slate-900">{t.admin.customers.detail.profile}</h2>
        <p className="mt-2 text-sm text-slate-600">{user.email}</p>
        {user.phone && <p className="text-sm text-slate-600">{user.phone}</p>}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.customers.detail.orders}</h2>
        </div>
        {orders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">{t.admin.customers.detail.noOrders}</p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {orders.map((order) => (
              <Link
                key={order.orderNumber}
                href={`/admin/orders/${order.orderNumber}`}
                className="flex flex-col gap-2 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.createdAt, locale)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{formatPriceKRW(order.total)}</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
