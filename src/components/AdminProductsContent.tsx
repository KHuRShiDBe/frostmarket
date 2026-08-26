"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductStatus } from "@/data/products";
import { useLocale } from "@/context/LocaleContext";
import { useAdminProducts } from "@/hooks/useAdmin";
import { formatPriceKRW } from "@/lib/currency";
import { translateSpecValue } from "@/i18n";
import { ProductStatusBadge } from "./AdminStatusBadges";

const ALL = "all";
type StockFilter = "all" | "inStock" | "lowStock" | "outOfStock";
const LOW_STOCK_THRESHOLD = 5;

export default function AdminProductsContent() {
  const { t, locale } = useLocale();
  const { products, isLoading } = useAdminProducts();

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState(ALL);
  const [status, setStatus] = useState<ProductStatus | "all">(ALL);
  const [stockFilter, setStockFilter] = useState<StockFilter>(ALL);

  const brandOptions = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (q && !product.brand.toLowerCase().includes(q) && !product.model.toLowerCase().includes(q)) {
        return false;
      }
      if (brand !== ALL && product.brand !== brand) return false;
      if (status !== ALL && product.status !== status) return false;
      if (stockFilter === "inStock" && product.stock <= LOW_STOCK_THRESHOLD) return false;
      if (stockFilter === "lowStock" && (product.stock === 0 || product.stock > LOW_STOCK_THRESHOLD)) return false;
      if (stockFilter === "outOfStock" && product.stock !== 0) return false;
      return true;
    });
  }, [products, query, brand, status, stockFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.admin.products.heading}</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.admin.products.addProduct}
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.admin.products.searchPlaceholder}
          className="w-full max-w-sm rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value={ALL}>{t.admin.products.allBrands}</option>
          {brandOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProductStatus | "all")}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value={ALL}>{t.admin.products.allStatuses}</option>
          <option value="active">{t.admin.status.active}</option>
          <option value="draft">{t.admin.status.draft}</option>
          <option value="outOfStock">{t.admin.status.outOfStock}</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as StockFilter)}
          className="rounded-full border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value="all">{t.admin.products.stockFilter.all}</option>
          <option value="inStock">{t.admin.products.stockFilter.inStock}</option>
          <option value="lowStock">{t.admin.products.stockFilter.lowStock}</option>
          <option value="outOfStock">{t.admin.products.stockFilter.outOfStock}</option>
        </select>

        <span className="text-xs text-slate-400">{t.admin.products.resultCount(filtered.length)}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!isLoading && filtered.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-slate-400">{t.admin.products.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.image}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.brand}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.model}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.price}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.capacity}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.stock}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.status}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.products.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3 sm:px-6">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-white">
                        <Image src={product.mainImage} alt={product.model} fill className="object-contain p-1" sizes="48px" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 sm:px-6">{product.brand}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">{product.model}</td>
                    <td className="px-5 py-3.5 text-slate-700 sm:px-6">{formatPriceKRW(product.price)}</td>
                    <td className="px-5 py-3.5 text-slate-500 sm:px-6">
                      {translateSpecValue(product.totalCapacity, locale)}
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <span className={product.stock <= LOW_STOCK_THRESHOLD ? "font-semibold text-rose-500" : "text-slate-700"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-sky-300 hover:text-sky-600"
                      >
                        {t.admin.common.edit}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
