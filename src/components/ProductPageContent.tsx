"use client";

import Image from "next/image";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import ContactTrigger from "@/components/ContactTrigger";
import FavoriteToggle from "@/components/FavoriteToggle";
import CompareToggle from "@/components/CompareToggle";
import AddToCartButton from "@/components/AddToCartButton";
import RelatedProductCard from "@/components/RelatedProductCard";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import RecordRecentlyViewed from "@/components/RecordRecentlyViewed";
import { getBrandEnglishName, products, SPEC_PENDING, type Product } from "@/data/products";
import {
  getFullSpecRows,
  getLocalizedHighlights,
  localizedBrandName,
  translateKeyFeatures,
  translateSpecValue,
} from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { formatPriceKRW } from "@/lib/currency";

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighlightIcon({ highlightKey }: { highlightKey: string }) {
  const common = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (highlightKey === "capacity") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="2" {...common} />
        <path d="M4 10h16" {...common} />
      </svg>
    );
  }
  if (highlightKey === "doorType") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="6" y="3" width="12" height="18" rx="1.5" {...common} />
        <path d="M14.5 12h.01" {...common} />
      </svg>
    );
  }
  if (highlightKey === "color") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" {...common} />
        <circle cx="12" cy="12" r="2.8" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" {...common} />
    </svg>
  );
}

export default function ProductPageContent({ product }: { product: Product }) {
  const { locale, t } = useLocale();

  const specRows = getFullSpecRows(product, locale);
  const highlights = getLocalizedHighlights(product, locale);
  const keyFeatures = translateKeyFeatures(product.keyFeatures, locale);
  const pendingLabel = translateSpecValue(SPEC_PENDING, locale);

  const brandDisplay = localizedBrandName(product.brand, locale);
  const brandEnglish = getBrandEnglishName(product.brand);
  const brandPending = product.brand === SPEC_PENDING;

  // Only recommend products from the same (confirmed) brand.
  const similarProducts =
    product.brand !== SPEC_PENDING
      ? products.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 3)
      : [];

  const remainingImages = product.images.filter((img) => img !== product.mainImage);

  return (
    <main className="flex-1 bg-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[94%] max-w-[1400px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          {t.productPage.backToList}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[9fr_11fr] lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ProductGallery title={product.model} images={product.images} mainImage={product.mainImage} />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-bold uppercase tracking-wide sm:text-base ${
                      brandPending ? "italic text-slate-400" : "text-sky-600"
                    }`}
                  >
                    {brandDisplay}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {t.common.refrigeratorCategory}
                  </span>
                </div>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
                  {product.model}
                </h1>
                <p className="mt-2 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
                  {formatPriceKRW(product.price)}
                </p>
              </div>
              <FavoriteToggle productId={product.id} model={product.model} variant="inline" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <AddToCartButton productId={product.id} />
              <ContactTrigger
                productId={product.id}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 sm:w-auto"
              >
                <MessageIcon />
                {t.productPage.purchaseInquiry}
              </ContactTrigger>
              <FavoriteToggle productId={product.id} model={product.model} variant="pill" />
              <CompareToggle productId={product.id} model={product.model} variant="pill" />
            </div>

            {brandEnglish && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 font-heading text-base font-bold text-sky-600">
                  {brandDisplay.charAt(0)}
                </span>
                <div>
                  <p className="font-heading text-base font-bold text-slate-900">{brandDisplay}</p>
                  <p className="text-sm text-slate-400">{brandEnglish}</p>
                </div>
              </div>
            )}

            {highlights.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {highlights.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="text-sky-600">
                      <HighlightIcon highlightKey={item.key} />
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {t.productPage.specEyebrow}
          </span>
          <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t.productPage.specHeading}
          </h2>

          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-2 sm:max-w-2xl">
            {specRows.map((row) => (
              <div key={row.key} className="flex flex-col gap-1 bg-white px-5 py-4">
                <dt className="text-xs text-slate-400">{row.label}</dt>
                <dd
                  className={row.isPending ? "text-sm italic text-slate-400" : "text-sm font-semibold text-slate-900"}
                >
                  {row.value}
                </dd>
              </div>
            ))}
            <div className="flex flex-col gap-1 bg-white px-5 py-4 sm:col-span-2">
              <dt className="text-xs text-slate-400">{t.specLabels.keyFeatures}</dt>
              {keyFeatures.length > 0 ? (
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-sm font-semibold text-slate-900">
                    {keyFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </dd>
              ) : (
                <dd className="text-sm italic text-slate-400">{pendingLabel}</dd>
              )}
            </div>
          </dl>

          {product.notes && <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:max-w-xl">{product.notes}</p>}

          <p className="mt-4 text-sm text-slate-400">{t.productPage.pendingNote(pendingLabel)}</p>
        </section>

        {remainingImages.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              {t.productPage.imagesHeading}
            </span>
            <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
              {t.productPage.imagesHeading}
            </h2>

            <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-6">
              {remainingImages.map((img, i) => (
                <div
                  key={img}
                  className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[480px] sm:aspect-auto"
                >
                  <Image
                    src={img}
                    alt={t.productPage.imageAtIndex(i + 2)}
                    fill
                    className="object-contain p-6"
                    sizes="(min-width: 640px) 672px, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {similarProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              {t.productPage.similarHeading}
            </span>
            <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
              {t.productPage.similarHeading}
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {similarProducts.map((similar) => (
                <RelatedProductCard key={similar.id} product={similar} />
              ))}
            </div>
          </section>
        )}

        <RecentlyViewedSection currentProductId={product.id} />

        <section
          id="inquiry"
          className="mt-16 scroll-mt-24 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            {t.productPage.shippingEyebrow}
          </span>
          <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t.productPage.shippingHeading}
          </h2>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
              {t.productPage.shippingBody}
              <br />
              {t.productPage.shippingBody2}
            </p>
          </div>
        </section>

        <section className="mt-16 border-t border-slate-200 pt-10 text-center sm:mt-20 sm:pt-12">
          <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t.productPage.ctaHeading}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{t.productPage.ctaBody}</p>
          <ContactTrigger
            productId={product.id}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <MessageIcon />
            {t.productPage.purchaseInquiry}
          </ContactTrigger>
        </section>
      </div>

      <RecordRecentlyViewed productId={product.id} />
    </main>
  );
}
