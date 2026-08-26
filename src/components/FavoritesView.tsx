"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "@/context/LocaleContext";

export default function FavoritesView() {
  const { favoriteIds } = useFavorites();
  const { t } = useLocale();
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <p className="text-sm text-slate-500">{t.favoritesView.emptyText}</p>
        <Link
          href="/#catalog"
          className="mt-4 inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
        >
          {t.favoritesView.browseCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-14 lg:gap-20">
      {favoriteProducts.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
