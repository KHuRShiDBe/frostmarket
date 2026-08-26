"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductFullName, SPEC_PENDING, type Product } from "@/data/products";
import { COMPARE_SECTIONS, getBestProductIds, rowValuesAreIdentical, type CompareRow } from "@/lib/compare";
import { translateSpecValue, localizedBrandName, translateKeyFeatures } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompareSpecTable({
  products,
  showDiffOnly,
}: {
  products: Product[];
  showDiffOnly: boolean;
}) {
  const { locale, t } = useLocale();

  const displayValue = (row: CompareRow, product: Product): { value: string; isPending: boolean } => {
    const raw = row.get(product);
    if (row.labelKey === "brand") {
      return { value: localizedBrandName(product.brand, locale), isPending: raw === SPEC_PENDING };
    }
    if (row.labelKey === "keyFeatures") {
      if (product.keyFeatures.length === 0) {
        return { value: translateSpecValue(SPEC_PENDING, locale), isPending: true };
      }
      return { value: translateKeyFeatures(product.keyFeatures, locale).join(", "), isPending: false };
    }
    return { value: translateSpecValue(raw, locale), isPending: raw === SPEC_PENDING };
  };

  const sections = COMPARE_SECTIONS.map((section) => ({
    ...section,
    rows: section.rows.filter(
      (row) => !showDiffOnly || !rowValuesAreIdentical(row, products),
    ),
  })).filter((section) => section.rows.length > 0);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="w-40 shrink-0 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 sm:w-48">
              {t.comparePage.itemColumn}
            </th>
            {products.map((product) => (
              <th
                key={product.id}
                className="min-w-[140px] bg-slate-50 px-4 py-3 text-center align-top"
              >
                <div className="relative mx-auto mb-2 h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image
                    src={product.mainImage}
                    alt={getProductFullName(product)}
                    fill
                    className="object-contain p-1.5"
                    sizes="56px"
                  />
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="font-heading text-sm font-bold text-slate-900 transition-colors hover:text-sky-600"
                >
                  {product.model}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.titleKey}>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th
                  colSpan={products.length + 1}
                  scope="colgroup"
                  className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-sky-600"
                >
                  {t.specSections[section.titleKey]}
                </th>
              </tr>
              {section.rows.map((row) => {
                const bestIds = getBestProductIds(row, products);
                return (
                  <tr key={row.labelKey} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {t.specLabels[row.labelKey]}
                    </td>
                    {products.map((product) => {
                      const { value, isPending } = displayValue(row, product);
                      const isBest = bestIds.has(product.id);
                      return (
                        <td
                          key={product.id}
                          className={`px-4 py-3 text-center text-sm ${
                            isPending
                              ? "italic text-slate-400"
                              : isBest
                                ? "font-semibold text-emerald-700"
                                : "font-medium text-slate-900"
                          }`}
                        >
                          {isBest && (
                            <span className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 align-middle text-emerald-600">
                              <CheckIcon />
                            </span>
                          )}
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
