"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import RevenueChart from "./RevenueChart";
import { PaymentStatusBadge, OrderStatusBadge } from "./AdminStatusBadges";

export default function AdminDashboardContent() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [range, setRange] = useState<7 | 30>(7);
  const { metrics, recentOrders, isLoading } = useAdminDashboard(range);

  const kpis = metrics
    ? [
        { label: t.admin.dashboard.kpi.revenue, value: formatPriceKRW(metrics.revenue) },
        { label: t.admin.dashboard.kpi.orders, value: String(metrics.ordersCount) },
        { label: t.admin.dashboard.kpi.customers, value: String(metrics.customersCount) },
        { label: t.admin.dashboard.kpi.products, value: String(metrics.productsCount) },
        {
          label: t.admin.dashboard.kpi.avgOrderValue,
          value: formatPriceKRW(Math.round(metrics.avgOrderValue)),
        },
        {
          label: t.admin.dashboard.kpi.avgRating,
          value: metrics.reviewsCount > 0 ? metrics.avgRating.toFixed(1) : "—",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.admin.dashboard.heading}</h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {(isLoading ? Array.from({ length: 6 }) : kpis).map((kpi, i) => (
          <div
            key={isLoading ? i : (kpi as { label: string }).label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {isLoading ? " " : (kpi as { label: string }).label}
            </p>
            <p className="mt-2 font-heading text-lg font-bold text-slate-900 sm:text-2xl">
              {isLoading ? "…" : (kpi as { value: string }).value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-base font-bold text-slate-900">
            {t.admin.dashboard.revenueChart.heading}
          </h2>
          <div className="inline-flex rounded-full border border-slate-200 p-1">
            <button
              type="button"
              onClick={() => setRange(7)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                range === 7 ? "bg-sky-600 text-white" : "text-slate-500 hover:text-sky-600"
              }`}
            >
              {t.admin.dashboard.revenueChart.last7Days}
            </button>
            <button
              type="button"
              onClick={() => setRange(30)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                range === 30 ? "bg-sky-600 text-white" : "text-slate-500 hover:text-sky-600"
              }`}
            >
              {t.admin.dashboard.revenueChart.last30Days}
            </button>
          </div>
        </div>
        <div className="mt-5">{metrics && <RevenueChart points={metrics.revenueByDay} />}</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="font-heading text-base font-bold text-slate-900">
            {t.admin.dashboard.recentOrders.heading}
          </h2>
          <Link href="/admin/orders" className="text-sm font-medium text-sky-600 hover:text-sky-700">
            {t.admin.dashboard.recentOrders.viewAll}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400 sm:px-6">
            {t.admin.dashboard.recentOrders.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.orderNumber}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.customer}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.date}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.total}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.paymentStatus}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.orderStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.orderNumber}
                    onClick={() => router.push(`/admin/orders/${order.orderNumber}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(`/admin/orders/${order.orderNumber}`);
                    }}
                    tabIndex={0}
                    className="cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
                      <Link href={`/admin/orders/${order.orderNumber}`} className="hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 sm:px-6">
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 sm:px-6">{formatDate(order.createdAt, locale)}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
                      {formatPriceKRW(order.total)}
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
