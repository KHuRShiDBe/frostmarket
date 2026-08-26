import type { Order } from "@/services/orders";

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface DashboardMetrics {
  revenue: number;
  ordersCount: number;
  customersCount: number;
  productsCount: number;
  avgOrderValue: number;
  avgRating: number;
  reviewsCount: number;
  revenueByDay: RevenuePoint[];
}

/** One bucket per day for the last `days` days (oldest first), 0-filled where there's no revenue. */
export function buildRevenueByDay(paidOrders: Order[], days: number): RevenuePoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const order of paidOrders) {
    const day = order.createdAt.slice(0, 10);
    if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + order.total);
  }

  return Array.from(buckets.entries()).map(([date, revenue]) => ({ date, revenue }));
}

/**
 * All dashboard KPIs, computed straight from Orders/Users/Products/Reviews —
 * never a hardcoded number. Revenue only counts orders that actually paid;
 * Average Order Value is Revenue / (number of paid orders).
 */
export function computeDashboardMetrics(
  orders: Order[],
  customersCount: number,
  productsCount: number,
  reviewRatings: number[],
  revenueRangeDays: number,
): DashboardMetrics {
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  const avgRating =
    reviewRatings.length > 0 ? reviewRatings.reduce((sum, r) => sum + r, 0) / reviewRatings.length : 0;

  return {
    revenue,
    ordersCount: orders.length,
    customersCount,
    productsCount,
    avgOrderValue,
    avgRating,
    reviewsCount: reviewRatings.length,
    revenueByDay: buildRevenueByDay(paidOrders, revenueRangeDays),
  };
}
