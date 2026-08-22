"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ContactTrigger from "./ContactTrigger";
import FavoritesNavLink from "./FavoritesNavLink";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d={open ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const mobileLinkClass =
  "rounded-lg px-3 py-3 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-sky-600";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:py-3 sm:px-6">
        <Link
          href="/"
          aria-label="FrostMarket — 홈으로"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-x-4 gap-y-1.5 text-sm text-slate-600 sm:flex sm:flex-wrap sm:gap-x-6">
          <Link href="/#catalog" className="transition-colors hover:text-sky-600">
            제품 목록
          </Link>
          <FavoritesNavLink className="transition-colors hover:text-sky-600" />
          <Link href="/about" className="transition-colors hover:text-sky-600">
            FrostMarket 소개
          </Link>
          <ContactTrigger className="transition-colors hover:text-sky-600">
            문의하기
          </ContactTrigger>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out sm:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0 overflow-hidden border-t border-slate-200 px-2 py-2">
          <div className="flex flex-col">
            <Link href="/#catalog" onClick={close} className={mobileLinkClass}>
              제품 목록
            </Link>
            <Link href="/about" onClick={close} className={mobileLinkClass}>
              FrostMarket 소개
            </Link>
            <FavoritesNavLink onClick={close} className={mobileLinkClass} />
            <ContactTrigger onClick={close} className={mobileLinkClass}>
              문의하기
            </ContactTrigger>
          </div>
        </nav>
      </div>
    </header>
  );
}
