"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesView() {
  const { favoriteIds } = useFavorites();
  const favoriteProducts = products.filter((product) => favoriteIds.includes(product.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <p className="text-sm text-slate-500">
          아직 관심 제품이 없습니다. 하트를 눌러 마음에 드는 냉장고를
          저장해 보세요.
        </p>
        <Link
          href="/#catalog"
          className="mt-4 inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
        >
          전체 제품 보러 가기 →
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
