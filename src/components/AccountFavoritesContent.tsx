"use client";

import FavoritesView from "./FavoritesView";
import { useLocale } from "@/context/LocaleContext";

export default function AccountFavoritesContent() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.header.favoritesLink}</h1>
      <FavoritesView />
    </div>
  );
}
