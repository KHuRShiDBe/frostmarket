"use client";

import type { MouseEvent } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "@/context/LocaleContext";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    >
      <path
        d="M12 20.5s-7-4.4-9.5-8.8C.9 8.7 2.3 4.5 6.3 4.5c2.2 0 3.7 1.3 5.7 3.5 2-2.2 3.5-3.5 5.7-3.5 4 0 5.4 4.2 3.8 7.2C19 16.1 12 20.5 12 20.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FavoriteToggle({
  productId,
  model,
  variant = "overlay",
}: {
  productId: string;
  model: string;
  variant?: "overlay" | "inline" | "pill";
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLocale();
  const active = isFavorite(productId);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  const ariaLabel = active ? t.favoriteToggle.removeAria(model) : t.favoriteToggle.addAria(model);

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={ariaLabel}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto ${
          active
            ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100"
            : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-600"
        }`}
      >
        <HeartIcon filled={active} />
        {active ? t.favoriteToggle.removePill : t.favoriteToggle.addPill}
      </button>
    );
  }

  const positionClasses =
    variant === "overlay"
      ? "absolute left-4 top-4 z-10 sm:left-6 sm:top-6"
      : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={ariaLabel}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors ${positionClasses} ${
        active
          ? "border-rose-300 bg-rose-50 text-rose-500"
          : "border-slate-200 bg-white/90 text-slate-400 hover:border-rose-200 hover:text-rose-400"
      }`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
