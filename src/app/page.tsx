"use client";

import Link from "next/link";
import ProductCatalog from "@/components/ProductCatalog";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import { products } from "@/data/products";
import { useLocale } from "@/context/LocaleContext";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const INITIAL_ACTIVE_PRODUCTS = products.filter((product) => product.status === "active");

export default function Home() {
  const { t } = useLocale();
  const catalogProducts = useCatalogProducts(INITIAL_ACTIVE_PRODUCTS);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-[-80px] h-[320px] w-[320px] rounded-full bg-sky-100/60 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto w-[92%] max-w-[1560px] py-8 text-center sm:py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-sky-700 shadow-sm backdrop-blur">
            {t.hero.badge}
          </span>

          <h1 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {t.hero.titleLine1}
            <br className="hidden sm:block" /> {t.hero.titleLine2}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            {t.hero.description}
          </p>

          <div className="mt-6">
            <Link
              href="/finder"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-600/20 transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:text-base"
            >
              <SparkleIcon />
              {t.finder.ctaButton}
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
            <span className="h-px w-8 bg-slate-300" aria-hidden />
            {t.hero.divider}
            <span className="h-px w-8 bg-slate-300" aria-hidden />
          </div>
        </div>
      </section>

      <section id="catalog" className="scroll-mt-20 py-6 sm:py-8">
        <div className="mx-auto w-[92%] max-w-[1560px]">
          <div className="mb-4 flex flex-col gap-1.5 sm:mb-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              {t.catalogSection.eyebrow}
            </span>
            <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              {t.catalogSection.heading}
            </h2>
          </div>

          <ProductCatalog products={catalogProducts} />
        </div>
      </section>

      <RecentlyViewedSection className="mx-auto w-[92%] max-w-[1560px] scroll-mt-20 border-t border-slate-200 py-14 sm:py-20" />

      <section
        id="about"
        className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-14 sm:py-20"
      >
        <div className="mx-auto w-[92%] max-w-[1560px]">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              {t.homeAbout.eyebrow}
            </span>
            <h2 className="mt-1.5 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              {t.homeAbout.heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
              {t.homeAbout.body}
            </p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-20 border-t border-slate-200 py-14 sm:py-20"
      >
        <div className="mx-auto w-[92%] max-w-[1560px]">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              {t.homeContact.eyebrow}
            </span>
            <h2 className="mt-1.5 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              {t.homeContact.heading}
            </h2>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
                {t.homeContact.body1}
                <br />
                {t.homeContact.body2}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
