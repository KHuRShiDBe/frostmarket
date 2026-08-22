"use client";

import Image from "next/image";
import { useCompare } from "@/context/CompareContext";
import { getProductFullName, products } from "@/data/products";

export default function CompareBar() {
  const { selectedIds, remove, clear, openModal } = useCompare();

  if (selectedIds.length === 0) return null;

  const selectedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  const canCompare = selectedProducts.length >= 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto flex w-[92%] max-w-[1560px] flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3"
            >
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white">
                <Image
                  src={product.mainImage}
                  alt={getProductFullName(product)}
                  fill
                  className="object-contain p-0.5"
                  sizes="32px"
                />
              </span>
              <span className="text-xs font-medium text-slate-700">{product.model}</span>
              <button
                type="button"
                onClick={() => remove(product.id)}
                aria-label={`${product.model} 비교에서 제거`}
                className="text-sm leading-none text-slate-400 transition-colors hover:text-slate-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-xs text-slate-400 transition-colors hover:text-sky-600 hover:underline"
          >
            전체 해제
          </button>
          <button
            type="button"
            onClick={openModal}
            disabled={!canCompare}
            title={canCompare ? undefined : "비교하려면 2개 이상 선택하세요"}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            비교하기 ({selectedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
}
