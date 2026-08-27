"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/services/orders";
import { useLocale } from "@/context/LocaleContext";
import { useAdminOrders } from "@/hooks/useAdmin";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { PaymentStatusBadge, OrderStatusBadge } from "./AdminStatusBadges";

const ALL = "all";
const STATUS_FILTERS: (OrderStatus | "all")[] = ["all", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersContent() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { orders, isLoading } = useAdminOrders();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">(ALL);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== ALL && order.orderStatus !== statusFilter) return false;
      if (!q) return true;
      const customerName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        customerName.includes(q) ||
        order.customer.email.toLowerCase().includes(q)
      );
    });
  }, [orders, query, statusFilter]);

  const filterLabel = (status: OrderStatus | "all"): string =>
    status === "all" ? t.admin.orders.filters.all : t.account.orders.orderStatusValues[status];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.admin.orders.heading}</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.admin.orders.searchPlaceholder}
          className="w-full max-w-sm rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
        />
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-500 hover:border-sky-300 hover:text-sky-600"
              }`}
            >
              {filterLabel(status)}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{t.admin.orders.resultCount(filtered.length)}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!isLoading && filtered.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-slate-400">{t.admin.orders.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.orderNumber}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.customer}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.date}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.items}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.total}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.paymentStatus}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.orders.columns.orderStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => (
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
                      <div>{order.customer.firstName} {order.customer.lastName}</div>
                      <div className="text-xs text-slate-400">{order.customer.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 sm:px-6">{formatDate(order.createdAt, locale)}</td>
                    <td className="px-5 py-3.5 text-slate-500 sm:px-6">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
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
