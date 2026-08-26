"use client";

import Image from "next/image";
import Link from "next/link";
import { SPEC_PENDING, type Product } from "@/data/products";
import { localizedBrandName } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import FavoriteToggle from "./FavoriteToggle";
import CompareToggle from "./CompareToggle";

export default function RecentlyViewedCard({ product }: { product: Product }) {
  const { locale } = useLocale();
  const brand = localizedBrandName(product.brand, locale);
  const brandPending = product.brand === SPEC_PENDING;

  return (
    <div className="group relative w-48 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-md sm:w-56">
      <FavoriteToggle productId={product.id} model={product.model} />
      <CompareToggle productId={product.id} model={product.model} />

      <Link
        href={`/products/${product.id}`}
        aria-label={product.model}
        className="flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <div className="relative aspect-square w-full bg-white p-4">
          <Image
            src={product.mainImage}
            alt={product.model}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 640px) 224px, 192px"
          />
        </div>
        <div className="border-t border-slate-100 p-3.5">
          <p
            className={`text-xs font-semibold ${brandPending ? "italic text-slate-400" : "text-sky-600"}`}
          >
            {brand}
          </p>
          <p className="mt-0.5 text-sm font-bold text-slate-900">{product.model}</p>
        </div>
      </Link>
    </div>
  );
}
