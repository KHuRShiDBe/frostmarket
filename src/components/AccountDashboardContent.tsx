"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useUserReviews } from "@/hooks/useReviews";
import { getOrderRepository } from "@/services/orders";

export default function AccountDashboardContent() {
  const { user } = useAuth();
  const { t } = useLocale();
  const { count: favoritesCount } = useFavorites();
  const { recentIds } = useRecentlyViewed();
  const { reviews } = useUserReviews(user?.id ?? null);

  if (!user) return null;

  const ordersCount = getOrderRepository().getByUserId(user.id).length;

  const cards = [
    {
      href: "/account/orders",
      label: t.account.nav.orders,
      value: t.account.dashboard.ordersCount(ordersCount),
    },
    {
      href: "/account/reviews",
      label: t.account.nav.reviews,
      value: t.account.dashboard.reviewsCount(reviews.length),
    },
    {
      href: "/account/favorites",
      label: t.header.favoritesLink,
      value: t.account.dashboard.favoritesCount(favoritesCount),
    },
    {
      href: "/account/recently-viewed",
      label: t.recentlyViewed.heading,
      value: t.account.dashboard.recentlyViewedCount(recentIds.length),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
          {t.account.dashboard.eyebrow}
        </span>
        <h1 className="mt-1.5 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.account.greeting(user.firstName)}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-sky-300"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</span>
            <span className="font-heading text-3xl font-bold text-slate-900">{card.value}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
