"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";

const NAV_ITEMS = ["dashboard", "products", "orders", "customers", "reviews", "settings"] as const;
type NavKey = (typeof NAV_ITEMS)[number];

const NAV_HREFS: Record<NavKey, string> = {
  dashboard: "/admin",
  products: "/admin/products",
  orders: "/admin/orders",
  customers: "/admin/customers",
  reviews: "/admin/reviews",
  settings: "/admin/settings",
};

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminLayoutShell({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  useEffect(() => {
    // Close the mobile nav drawer whenever the route changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileNavOpen(false);
  }, [pathname]);

  if (isLoading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-24 text-center">
        <p className="text-sm text-slate-400">{t.account.guardRedirectNotice}</p>
      </main>
    );
  }

  if (user.role !== "admin") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-slate-900">{t.admin.accessDenied.title}</h1>
        <p className="max-w-sm text-sm text-slate-500">{t.admin.accessDenied.body}</p>
        <Link
          href="/"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.admin.accessDenied.backLink}
        </Link>
      </main>
    );
  }

  const isActive = (key: NavKey): boolean => {
    const href = NAV_HREFS[key];
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navList = (onNavigate?: () => void) => (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((key) => (
        <Link
          key={key}
          href={NAV_HREFS[key]}
          onClick={onNavigate}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive(key) ? "bg-sky-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t.admin.nav[key]}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label={t.header.menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          >
            <MenuIcon />
          </button>
          <Link href="/admin" aria-label={t.admin.nav.dashboard}>
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-sm font-medium text-slate-600 sm:inline">
            {user.firstName} {user.lastName}
          </span>
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/"
            className="hidden text-sm font-medium text-slate-500 transition-colors hover:text-sky-600 sm:inline"
          >
            {t.admin.topbar.viewSite}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-rose-300 hover:text-rose-600"
          >
            {t.auth.signOut}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
          {navList()}
        </aside>

        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-50 flex md:hidden"
            onClick={() => setMobileNavOpen(false)}
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t.admin.nav.dashboard}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-64 flex-col gap-4 border-r border-slate-200 bg-white p-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label={t.header.menuClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <CloseIcon />
                </button>
              </div>
              {navList(() => setMobileNavOpen(false))}
              <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4">
                <LanguageSwitcher />
                <Link href="/" className="text-sm font-medium text-slate-500 hover:text-sky-600">
                  {t.admin.topbar.viewSite}
                </Link>
              </div>
            </div>
            <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" aria-hidden />
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
