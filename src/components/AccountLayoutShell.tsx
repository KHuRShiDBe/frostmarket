"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";

const NAV_ITEMS = ["overview", "orders", "reviews", "favorites", "recentlyViewed", "profile"] as const;
type NavKey = (typeof NAV_ITEMS)[number];

const NAV_HREFS: Record<NavKey, string> = {
  overview: "/account",
  orders: "/account/orders",
  reviews: "/account/reviews",
  favorites: "/account/favorites",
  recentlyViewed: "/account/recently-viewed",
  profile: "/account/profile",
};

export default function AccountLayoutShell({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return (
      <main className="flex-1 px-4 py-20 text-center sm:px-6">
        <p className="text-sm text-slate-400">{t.account.guardRedirectNotice}</p>
      </main>
    );
  }

  const labelFor = (key: NavKey): string => {
    switch (key) {
      case "overview":
        return t.account.nav.overview;
      case "orders":
        return t.account.nav.orders;
      case "reviews":
        return t.account.nav.reviews;
      case "favorites":
        return t.header.favoritesLink;
      case "recentlyViewed":
        return t.recentlyViewed.heading;
      case "profile":
        return t.account.nav.profile;
    }
  };

  const isActive = (key: NavKey): boolean => {
    const href = NAV_HREFS[key];
    return href === "/account" ? pathname === "/account" : pathname.startsWith(href);
  };

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1200px]">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-12">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {NAV_ITEMS.map((key) => (
              <Link
                key={key}
                href={NAV_HREFS[key]}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(key) ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {labelFor(key)}
              </Link>
            ))}
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
