"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactTrigger from "./ContactTrigger";
import AddToCartButton from "./AddToCartButton";
import { useQuickView } from "@/context/QuickViewContext";
import { getProductFullName, SPEC_PENDING } from "@/data/products";
import { getProductService } from "@/services/products";
import { translateSpecValue } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { formatPriceKRW } from "@/lib/currency";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function QuickViewModal() {
  const { productId, closeQuickView } = useQuickView();
  const { locale, t } = useLocale();
  const product = productId ? getProductService().getProduct(productId) : null;

  useEffect(() => {
    if (!product) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [product, closeQuickView]);

  if (!product) return null;

  const brandPending = product.brand === SPEC_PENDING;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onClick={closeQuickView}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl sm:grid-cols-2 sm:overflow-visible"
      >
        <div className="relative aspect-square w-full shrink-0 bg-white p-6 sm:p-10">
          <Image
            src={product.mainImage}
            alt={t.productPage.productImageAlt(getProductFullName(product))}
            fill
            className="object-contain p-2"
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </div>

        <div className="relative flex flex-col gap-3 p-6 sm:p-8">
          <button
            type="button"
            onClick={closeQuickView}
            aria-label={t.common.close}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <CloseIcon />
          </button>

          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {t.quickView.categoryLabel}
          </span>
          <h2
            id="quickview-title"
            className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {product.model}
          </h2>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">{t.quickView.brandLabel}</span>
            <span
              className={brandPending ? "italic text-slate-400" : "font-semibold text-slate-900"}
            >
              {brandPending ? translateSpecValue(product.brand, locale) : product.brand}
            </span>
          </div>

          <p className="font-heading text-xl font-bold text-slate-900">
            {formatPriceKRW(product.price)}
          </p>

          <p className="text-sm leading-relaxed text-slate-500">
            {t.quickView.description(product.model)}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <AddToCartButton
              productId={product.id}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 sm:flex-none"
            />
            <Link
              href={`/products/${product.id}`}
              onClick={closeQuickView}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 sm:flex-none"
            >
              {t.quickView.viewDetails}
            </Link>
            <ContactTrigger
              productId={product.id}
              onClick={closeQuickView}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 sm:flex-none"
            >
              {t.quickView.contact}
            </ContactTrigger>
          </div>
        </div>
      </div>
    </div>
  );
}
