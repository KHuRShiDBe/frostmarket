"use client";

import RelatedProductCard from "./RelatedProductCard";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { products, type Product } from "@/data/products";

export default function RecentlyViewedSection({ currentProductId }: { currentProductId: string }) {
  const { recentIds } = useRecentlyViewed();

  const items = recentIds
    .filter((id) => id !== currentProductId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
      <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
        최근 본 제품
      </span>
      <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
        최근 본 제품
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {items.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
