"use client";

import { useState } from "react";
import Link from "next/link";
import { MAX_COMPARE, useCompare } from "@/context/CompareContext";
import type { Product } from "@/data/products";
import { getProductService } from "@/services/products";
import { useLocale } from "@/context/LocaleContext";
import CompareProductCard from "./CompareProductCard";
import CompareSpecTable from "./CompareSpecTable";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function CompareView() {
  const { selectedIds, remove, clear } = useCompare();
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const { t } = useLocale();

  const selectedProducts = selectedIds
    .map((id) => getProductService().getProduct(id))
    .filter((p): p is Product => Boolean(p));

  if (selectedProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
        <p className="text-sm text-slate-500">{t.comparePage.emptyTitle}</p>
        <Link
          href="/#catalog"
          className="mt-4 inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
        >
          {t.comparePage.browseCta}
        </Link>
      </div>
    );
  }

  const canShowTable = selectedProducts.length >= 2;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {selectedProducts.map((product) => (
          <CompareProductCard
            key={product.id}
            product={product}
            onRemove={() => remove(product.id)}
          />
        ))}
        {selectedProducts.length < MAX_COMPARE && (
          <Link
            href="/#catalog"
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-slate-400 transition-colors hover:border-sky-300 hover:text-sky-600"
          >
            <PlusIcon />
            <span className="text-sm font-semibold">{t.comparePage.addAnother}</span>
          </Link>
        )}
      </div>

      {!canShowTable ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center">
          <p className="text-sm text-slate-500">{t.comparePage.oneMoreTitle}</p>
          <Link
            href="/#catalog"
            className="mt-4 inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
          >
            {t.comparePage.browseCta}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
              {t.comparePage.specHeading}
            </h2>
            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
                className="h-4 w-4 accent-sky-600"
              />
              {t.comparePage.showDiffOnly}
            </label>
          </div>

          <CompareSpecTable products={selectedProducts} showDiffOnly={showDiffOnly} />

          <p className="text-xs text-slate-400">{t.comparePage.bestNote}</p>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-slate-400 transition-colors hover:text-rose-500 hover:underline"
        >
          {t.comparePage.clearAll}
        </button>
      </div>
    </div>
  );
}
