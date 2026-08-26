"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { getOrderRepository, type Order } from "@/services/orders";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";

function PaymentBadge({ status, label }: { status: Order["paymentStatus"]; label: string }) {
  const styles: Record<Order["paymentStatus"], string> = {
    paid: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    failed: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>{label}</span>
  );
}

export default function AccountOrdersContent() {
  const { user } = useAuth();
  const { t, locale } = useLocale();

  if (!user) return null;

  const orders = getOrderRepository().getByUserId(user.id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.account.orders.title}</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm font-medium text-slate-600">{t.account.orders.empty}</p>
          <Link
            href="/#catalog"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            {t.checkout.emptyCart.cta}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/account/orders/${order.orderNumber}`}
              className="flex flex-col gap-3 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                <p className="text-xs text-slate-400">{formatDate(order.createdAt, locale)}</p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {order.items.map((item) => item.model).join(", ")}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1.5">
                <span className="text-sm font-bold text-slate-900">{formatPriceKRW(order.total)}</span>
                <div className="flex items-center gap-2">
                  <PaymentBadge
                    status={order.paymentStatus}
                    label={t.account.orders.paymentStatusValues[order.paymentStatus]}
                  />
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {t.account.orders.orderStatusValues[order.orderStatus]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
