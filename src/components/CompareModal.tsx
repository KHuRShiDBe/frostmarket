"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { getProductFullName, products, SPEC_PENDING, type Product } from "@/data/products";

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

const SPEC_FIELDS: { label: string; key: keyof Product }[] = [
  { label: "브랜드", key: "brand" },
  { label: "모델명", key: "model" },
  { label: "용량", key: "capacity" },
  { label: "크기", key: "dimensions" },
  { label: "색상", key: "color" },
  { label: "에너지등급", key: "energyGrade" },
  { label: "도어 타입", key: "doorType" },
  { label: "원산지", key: "countryOfOrigin" },
  { label: "보증", key: "warranty" },
  { label: "메모", key: "notes" },
];

export default function CompareModal() {
  const { selectedIds, isModalOpen, closeModal, remove } = useCompare();

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const selectedProducts = selectedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  if (selectedProducts.length < 2) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-start justify-between">
          <h2
            id="compare-modal-title"
            className="font-heading text-lg font-bold text-slate-900 sm:text-xl"
          >
            냉장고 비교하기
          </h2>
          <button
            type="button"
            onClick={closeModal}
            aria-label="닫기"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-28 pb-4 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-slate-400">
                  항목
                </th>
                {selectedProducts.map((product) => (
                  <th key={product.id} className="px-3 pb-4 text-center align-bottom">
                    <div className="relative mx-auto mb-2 h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      <Image
                        src={product.mainImage}
                        alt={getProductFullName(product)}
                        fill
                        className="object-contain p-1.5"
                        sizes="64px"
                      />
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      onClick={closeModal}
                      className="font-heading text-sm font-bold text-slate-900 transition-colors hover:text-sky-600"
                    >
                      {product.model}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="mt-1 block w-full text-xs text-slate-400 transition-colors hover:text-sky-600"
                    >
                      제거
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SPEC_FIELDS.map(({ label, key }) => (
                <tr key={key}>
                  <td className="py-3 pr-3 text-xs text-slate-500">{label}</td>
                  {selectedProducts.map((product) => {
                    const raw = product[key];
                    const value = key === "notes" ? raw || SPEC_PENDING : raw;
                    const isPending = value === SPEC_PENDING;
                    return (
                      <td
                        key={product.id}
                        className={`px-3 py-3 text-center text-sm ${
                          isPending ? "italic text-slate-400" : "font-medium text-slate-900"
                        }`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          &ldquo;{SPEC_PENDING}&rdquo;으로 표시된 항목은 아직 확정되지 않은
          사양입니다.
        </p>
      </div>
    </div>
  );
}
