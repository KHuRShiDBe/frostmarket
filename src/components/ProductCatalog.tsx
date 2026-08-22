"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { SPEC_PENDING, type Product } from "@/data/products";

const ALL = "전체";

const SORT_OPTIONS = ["기본순", "브랜드순", "모델명 오름차순", "모델명 내림차순"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

function sortProducts(list: Product[], sort: SortOption): Product[] {
  if (sort === "기본순") return list;

  const sorted = [...list];
  if (sort === "브랜드순") {
    sorted.sort(
      (a, b) => a.brand.localeCompare(b.brand, "ko") || a.model.localeCompare(b.model, "ko"),
    );
  } else if (sort === "모델명 오름차순") {
    sorted.sort((a, b) => a.model.localeCompare(b.model, "ko"));
  } else if (sort === "모델명 내림차순") {
    sorted.sort((a, b) => b.model.localeCompare(a.model, "ko"));
  }
  return sorted;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m20 20-3.8-3.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Extracts a leading number from a capacity string (e.g. "384L" -> 384). */
function parseCapacity(capacity: string): number | null {
  if (!capacity || capacity === SPEC_PENDING) return null;
  const match = capacity.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

/** Unique, confirmed (non-placeholder) values for a spec field across all products. */
function confirmedValues(products: Product[], field: keyof Product): string[] {
  const values = new Set(
    products
      .map((p) => p[field])
      .filter((v): v is string => typeof v === "string" && v !== "" && v !== SPEC_PENDING),
  );
  return Array.from(values).sort((a, b) => a.localeCompare(b, "ko"));
}

function BrandSelector({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const items = [ALL, ...options];

  return (
    <div
      role="group"
      aria-label="브랜드 선택"
      className="inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm"
    >
      {items.map((item) => {
        const active = value === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-sky-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
      <span className="text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="bg-transparent text-sm font-medium text-slate-900 outline-none"
      >
        <option value={ALL}>{ALL}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
      <span className="text-slate-400">정렬</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="정렬 기준"
        className="bg-transparent text-sm font-medium text-slate-900 outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ProductCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("기본순");
  const [brand, setBrand] = useState(ALL);
  const [doorType, setDoorType] = useState(ALL);
  const [color, setColor] = useState(ALL);
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");

  const brandOptions = useMemo(() => confirmedValues(products, "brand"), [products]);

  // 푸터의 "LG"/"Samsung" 링크(예: /?brand=LG)에서 들어온 경우, 해당 브랜드로
  // 필터를 미리 선택해 링크가 실제로 동작하도록 한다.
  useEffect(() => {
    const brandParam = new URLSearchParams(window.location.search).get("brand");
    if (brandParam && brandOptions.includes(brandParam)) {
      // Reading window.location (client-only) on mount to keep the homepage
      // statically prerendered; can't be a lazy useState initializer without
      // causing a hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBrand(brandParam);
    }
  }, [brandOptions]);
  const doorTypeOptions = useMemo(() => confirmedValues(products, "doorType"), [products]);
  const colorOptions = useMemo(() => confirmedValues(products, "color"), [products]);

  const capacityValues = useMemo(() => {
    const values = products
      .map((p) => parseCapacity(p.capacity))
      .filter((v): v is number => v !== null);
    return Array.from(new Set(values)).sort((a, b) => a - b);
  }, [products]);
  const hasCapacityFilter = capacityValues.length >= 2;
  const capacityBounds = hasCapacityFilter
    ? { min: capacityValues[0], max: capacityValues[capacityValues.length - 1] }
    : null;

  const hasOtherFilters = doorTypeOptions.length > 0 || colorOptions.length > 0 || hasCapacityFilter;

  const isFilterActive =
    query !== "" ||
    sort !== "기본순" ||
    brand !== ALL ||
    doorType !== ALL ||
    color !== ALL ||
    minCapacity !== "" ||
    maxCapacity !== "";

  const resetFilters = () => {
    setQuery("");
    setSort("기본순");
    setBrand(ALL);
    setDoorType(ALL);
    setColor(ALL);
    setMinCapacity("");
    setMaxCapacity("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minCapacity === "" ? null : Number(minCapacity);
    const max = maxCapacity === "" ? null : Number(maxCapacity);

    return products.filter((product) => {
      if (q && !product.model.toLowerCase().includes(q)) return false;
      if (brand !== ALL && product.brand !== brand) return false;
      if (doorType !== ALL && product.doorType !== doorType) return false;
      if (color !== ALL && product.color !== color) return false;

      if (min !== null || max !== null) {
        const cap = parseCapacity(product.capacity);
        if (cap === null) return false;
        if (min !== null && cap < min) return false;
        if (max !== null && cap > max) return false;
      }

      return true;
    });
  }, [products, query, brand, doorType, color, minCapacity, maxCapacity]);

  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:mb-10">
        {brandOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <BrandSelector value={brand} options={brandOptions} onChange={setBrand} />
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            >
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="모델명으로 검색"
              aria-label="모델명으로 검색"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          <SortSelect value={sort} onChange={setSort} />
        </div>

        {hasOtherFilters && (
          <div className="flex flex-wrap items-center gap-2.5">
            {doorTypeOptions.length > 0 && (
              <FilterSelect
                label="도어 타입"
                value={doorType}
                options={doorTypeOptions}
                onChange={setDoorType}
              />
            )}
            {colorOptions.length > 0 && (
              <FilterSelect label="색상" value={color} options={colorOptions} onChange={setColor} />
            )}
            {hasCapacityFilter && capacityBounds && (
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
                <span className="text-slate-400">용량</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={String(capacityBounds.min)}
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                  aria-label="최소 용량"
                  className="w-14 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-300"
                />
                <span className="text-slate-300">~</span>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={String(capacityBounds.max)}
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  aria-label="최대 용량"
                  className="w-14 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-300"
                />
                <span className="text-slate-400">L</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs text-slate-400">검색 결과 {sorted.length}개 제품</p>
          {isFilterActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-slate-400 underline-offset-2 transition-colors hover:text-sky-600 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 sm:gap-14 lg:gap-20">
          {sorted.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
