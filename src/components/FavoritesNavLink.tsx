"use client";

import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "@/context/LocaleContext";

export default function FavoritesNavLink({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { count } = useFavorites();
  const { t } = useLocale();

  return (
    <Link
      href="/favorites"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
    >
      {t.header.favoritesLink}
      {count > 0 && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
