"use client";

import Image from "next/image";
import Link from "next/link";
import { getProductFullName, SPEC_PENDING, type Product } from "@/data/products";
import { localizedBrandName } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { formatPriceKRW } from "@/lib/currency";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CompareProductCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) {
  const { locale, t } = useLocale();
  const brandDisplay = localizedBrandName(product.brand, locale);
  const brandPending = product.brand === SPEC_PENDING;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onRemove}
        aria-label={t.compareBar.removeAria(product.model)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-400 shadow-sm backdrop-blur transition-colors hover:border-rose-200 hover:text-rose-500"
      >
        <CloseIcon />
      </button>

      <div className="relative h-40 w-full shrink-0 bg-white p-4 sm:h-48 sm:p-6">
        <Image
          src={product.mainImage}
          alt={t.productPage.productImageAlt(getProductFullName(product))}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-slate-100 p-4 sm:p-5">
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              brandPending ? "italic text-slate-400" : "text-sky-600"
            }`}
          >
            {brandDisplay}
          </span>
          <h3 className="mt-0.5 font-heading text-base font-bold text-slate-900 sm:text-lg">
            {product.model}
          </h3>
          <p className="mt-1 text-sm font-bold text-slate-900">{formatPriceKRW(product.price)}</p>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-auto inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-sky-600 sm:text-sm"
        >
          {t.comparePage.goToProduct}
        </Link>
      </div>
    </div>
  );
}
