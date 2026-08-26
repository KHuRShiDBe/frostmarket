"use client";

import { useLocale } from "@/context/LocaleContext";
import type { ProductStatus } from "@/data/products";
import type { Order } from "@/services/orders";

export function PaymentStatusBadge({ status }: { status: Order["paymentStatus"] }) {
  const { t } = useLocale();
  const styles: Record<Order["paymentStatus"], string> = {
    paid: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    failed: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>
      {t.account.orders.paymentStatusValues[status]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: Order["orderStatus"] }) {
  const { t } = useLocale();
  const styles: Record<Order["orderStatus"], string> = {
    processing: "bg-sky-50 text-sky-600",
    shipped: "bg-amber-50 text-amber-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>
      {t.account.orders.orderStatusValues[status]}
    </span>
  );
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const { t } = useLocale();
  const styles: Record<ProductStatus, string> = {
    active: "bg-emerald-50 text-emerald-600",
    draft: "bg-slate-100 text-slate-500",
    outOfStock: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status]}`}>
      {t.admin.status[status]}
    </span>
  );
}
