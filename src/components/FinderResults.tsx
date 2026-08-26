"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { useLocale } from "@/context/LocaleContext";
import { useCompare, MAX_COMPARE, MIN_COMPARE } from "@/context/CompareContext";
import { getRecommendations, type FinderAnswers, type ScoredProduct } from "@/lib/finder";
import FinderResultCard from "./FinderResultCard";

const ALTERNATIVES_COUNT = 3;

interface RankedEntry {
  product: Product;
  scored: ScoredProduct;
}

export default function FinderResults({
  products,
  answers,
  onModify,
  onRestart,
}: {
  products: Product[];
  answers: FinderAnswers;
  onModify: () => void;
  onRestart: () => void;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const { toggle: toggleCompare, clear: clearCompare } = useCompare();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const ranked = useMemo<RankedEntry[]>(() => {
    const scoredList = getRecommendations(products, answers);
    const byId = new Map(products.map((p) => [p.id, p] as const));
    const entries: RankedEntry[] = [];
    for (const scored of scoredList) {
      const product = byId.get(scored.productId);
      if (product) entries.push({ product, scored });
    }
    return entries;
  }, [products, answers]);

  const best = ranked[0];
  const alternatives = ranked.slice(1, 1 + ALTERNATIVES_COUNT);

  if (!best) return null;

  const toggleSelectForCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((existing) => existing !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const handleCompareSelected = () => {
    clearCompare();
    for (const id of selectedForCompare) toggleCompare(id);
    router.push("/compare");
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.finder.results.heading}</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onModify}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
          >
            {t.finder.results.modifyAnswers}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-rose-300 hover:text-rose-600"
          >
            {t.finder.results.restart}
          </button>
        </div>
      </div>

      <FinderResultCard product={best.product} scored={best.scored} answers={answers} variant="hero" />

      {alternatives.length > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            {t.finder.results.alternativesHeading}
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {alternatives.map(({ product, scored }) => {
              const checked = selectedForCompare.includes(product.id);
              return (
                <div key={product.id} className="flex flex-col gap-2">
                  <label className="inline-flex w-fit cursor-pointer select-none items-center gap-2 text-xs font-medium text-slate-500">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelectForCompare(product.id)}
                      className="h-3.5 w-3.5 accent-sky-600"
                    />
                    {t.compareToggle.overlayLabel}
                  </label>
                  <FinderResultCard product={product} scored={scored} answers={answers} variant="compact" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {alternatives.length > 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">{t.finder.results.compareHint}</p>
          <button
            type="button"
            onClick={handleCompareSelected}
            disabled={selectedForCompare.length < MIN_COMPARE}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t.finder.results.compareSelected(selectedForCompare.length)}
          </button>
        </div>
      )}
    </div>
  );
}
