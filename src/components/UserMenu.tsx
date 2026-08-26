"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";

const menuLinkClass = "block rounded-xl px-3.5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50";

export default function UserMenu() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isLoading) {
    return <div className="h-9 w-9 shrink-0" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex shrink-0 items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
      >
        {t.auth.signIn}
      </Link>
    );
  }

  const initial = user.firstName.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    setOpen(false);
    logout();
    // A full navigation (not router.push) guarantees any mounted /account
    // guard doesn't race this redirect and bounce the user to /login instead
    // of home right after signing out.
    window.location.href = "/";
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t.account.userMenuAria}
        className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition-colors hover:border-sky-300"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[100px] truncate text-sm font-medium text-slate-700 sm:inline">
          {user.firstName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <Link href="/account" onClick={() => setOpen(false)} className={menuLinkClass}>
            {t.account.nav.overview}
          </Link>
          <Link href="/account/orders" onClick={() => setOpen(false)} className={menuLinkClass}>
            {t.account.nav.orders}
          </Link>
          <Link href="/account/favorites" onClick={() => setOpen(false)} className={menuLinkClass}>
            {t.header.favoritesLink}
          </Link>
          <Link href="/account/recently-viewed" onClick={() => setOpen(false)} className={menuLinkClass}>
            {t.recentlyViewed.heading}
          </Link>
          {user.role === "admin" && (
            <>
              <div className="my-1 border-t border-slate-100" />
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={`${menuLinkClass} font-medium text-sky-600 hover:bg-sky-50`}
              >
                {t.admin.nav.dashboard}
              </Link>
            </>
          )}
          <div className="my-1 border-t border-slate-100" />
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-xl px-3.5 py-2.5 text-left text-sm text-rose-500 transition-colors hover:bg-rose-50"
          >
            {t.auth.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
