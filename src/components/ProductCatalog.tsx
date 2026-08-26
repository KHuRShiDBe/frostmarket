"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { SPEC_PENDING, type Product } from "@/data/products";
import { translateSpecValue, type Locale, type TranslationDict } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import {
  CAPACITY_RANGES,
  hasIceMaker,
  isFeatureSupported,
  parseCapacityLiters,
  parseDoorCount,
  parseEnergyGrade,
  type CapacityRangeKey,
} from "@/lib/productSpecs";

const ALL = "all";

const SORT_OPTIONS = ["기본순", "브랜드순", "모델명 오름차순", "모델명 내림차순"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_SLUGS: Record<SortOption, string> = {
  기본순: "default",
  브랜드순: "brand",
  "모델명 오름차순": "model-asc",
  "모델명 내림차순": "model-desc",
};
const SORT_SLUGS_REVERSE: Record<string, SortOption> = Object.fromEntries(
  Object.entries(SORT_SLUGS).map(([option, slug]) => [slug, option as SortOption]),
);

function sortOptionLabel(option: SortOption, t: TranslationDict): string {
  switch (option) {
    case "기본순":
      return t.catalog.sortOptions.default;
    case "브랜드순":
      return t.catalog.sortOptions.brand;
    case "모델명 오름차순":
      return t.catalog.sortOptions.modelAsc;
    case "모델명 내림차순":
      return t.catalog.sortOptions.modelDesc;
  }
}

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

function toOptions(raw: string[], locale: Locale): Option[] {
  return raw.map((value) => ({ value, label: translateSpecValue(value, locale) }));
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m20 20-3.8-3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

interface Option {
  value: string;
  label: string;
}

function BrandSelector({
  value,
  options,
  allLabel,
  groupLabel,
  onChange,
}: {
  value: string;
  options: string[];
  allLabel: string;
  groupLabel: string;
  onChange: (value: string) => void;
}) {
  const items = [{ value: ALL, label: allLabel }, ...options.map((o) => ({ value: o, label: o }))];

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm"
    >
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-sky-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
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
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  allLabel: string;
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
        <option value={ALL}>{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleFilter({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm transition-colors ${
        checked
          ? "border-sky-500 bg-sky-50 text-sky-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-sky-600"
      />
      {label}
    </label>
  );
}

function SortSelect({
  value,
  onChange,
  label,
  t,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
  label: string;
  t: TranslationDict;
}) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 shadow-sm">
      <span className="text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label={label}
        className="bg-transparent text-sm font-medium text-slate-900 outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {sortOptionLabel(option, t)}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 py-1 pl-3 pr-1.5 text-xs font-medium text-sky-700">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={label}
        className="flex h-4 w-4 items-center justify-center rounded-full text-sky-400 transition-colors hover:bg-sky-100 hover:text-sky-600"
      >
        ×
      </button>
    </span>
  );
}

function EmptyState({ onReset, t }: { onReset: () => void; t: TranslationDict }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <p className="text-sm font-medium text-slate-600">{t.catalog.emptyTitle}</p>
      <p className="mt-1.5 text-sm text-slate-400">{t.catalog.emptyDescription}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
      >
        {t.catalog.resetFilters}
      </button>
    </div>
  );
}

interface AdvancedFilterFieldsProps {
  t: TranslationDict;
  capacityRangeOptions: Option[];
  capacityRange: string;
  onCapacityRangeChange: (value: string) => void;
  energyGradeOptions: Option[];
  energyGrade: string;
  onEnergyGradeChange: (value: string) => void;
  doorCountOptions: Option[];
  doorCount: string;
  onDoorCountChange: (value: string) => void;
  hasWifiData: boolean;
  wifiOnly: boolean;
  onWifiOnlyChange: (value: boolean) => void;
  hasIceMakerData: boolean;
  iceMakerOnly: boolean;
  onIceMakerOnlyChange: (value: boolean) => void;
  installationOptions: Option[];
  installationType: string;
  onInstallationTypeChange: (value: string) => void;
  compressorOptions: Option[];
  compressor: string;
  onCompressorChange: (value: string) => void;
}

function AdvancedFilterFields(props: AdvancedFilterFieldsProps) {
  const { t } = props;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {props.capacityRangeOptions.length > 0 && (
        <FilterSelect
          label={t.catalog.capacityLabel}
          value={props.capacityRange}
          options={props.capacityRangeOptions}
          allLabel={t.catalog.all}
          onChange={props.onCapacityRangeChange}
        />
      )}
      {props.energyGradeOptions.length > 0 && (
        <FilterSelect
          label={t.catalog.energyGradeLabel}
          value={props.energyGrade}
          options={props.energyGradeOptions}
          allLabel={t.catalog.all}
          onChange={props.onEnergyGradeChange}
        />
      )}
      {props.doorCountOptions.length > 0 && (
        <FilterSelect
          label={t.catalog.doorCountLabel}
          value={props.doorCount}
          options={props.doorCountOptions}
          allLabel={t.catalog.all}
          onChange={props.onDoorCountChange}
        />
      )}
      {props.installationOptions.length > 0 && (
        <FilterSelect
          label={t.catalog.installationLabel}
          value={props.installationType}
          options={props.installationOptions}
          allLabel={t.catalog.all}
          onChange={props.onInstallationTypeChange}
        />
      )}
      {props.compressorOptions.length > 0 && (
        <FilterSelect
          label={t.catalog.compressorLabel}
          value={props.compressor}
          options={props.compressorOptions}
          allLabel={t.catalog.all}
          onChange={props.onCompressorChange}
        />
      )}
      {props.hasWifiData && (
        <ToggleFilter label={t.catalog.wifiToggle} checked={props.wifiOnly} onChange={props.onWifiOnlyChange} />
      )}
      {props.hasIceMakerData && (
        <ToggleFilter
          label={t.catalog.iceMakerToggle}
          checked={props.iceMakerOnly}
          onChange={props.onIceMakerOnlyChange}
        />
      )}
    </div>
  );
}

export default function ProductCatalog({ products }: { products: Product[] }) {
  const { locale, t } = useLocale();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("기본순");
  const [brand, setBrand] = useState(ALL);
  const [doorType, setDoorType] = useState(ALL);
  const [color, setColor] = useState(ALL);
  const [capacityRange, setCapacityRange] = useState(ALL);
  const [energyGrade, setEnergyGrade] = useState(ALL);
  const [doorCount, setDoorCount] = useState(ALL);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [iceMakerOnly, setIceMakerOnly] = useState(false);
  const [installationType, setInstallationType] = useState(ALL);
  const [compressor, setCompressor] = useState(ALL);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const brandOptions = useMemo(() => confirmedValues(products, "brand"), [products]);
  const doorTypeRaw = useMemo(() => confirmedValues(products, "doorType"), [products]);
  const colorRaw = useMemo(() => confirmedValues(products, "color"), [products]);
  const installationRaw = useMemo(() => confirmedValues(products, "installationType"), [products]);
  const compressorRaw = useMemo(() => confirmedValues(products, "compressor"), [products]);

  const doorTypeOptions = useMemo(() => toOptions(doorTypeRaw, locale), [doorTypeRaw, locale]);
  const colorOptions = useMemo(() => toOptions(colorRaw, locale), [colorRaw, locale]);
  const installationOptions = useMemo(() => toOptions(installationRaw, locale), [installationRaw, locale]);
  const compressorOptions = useMemo(() => toOptions(compressorRaw, locale), [compressorRaw, locale]);

  const doorCountValues = useMemo(() => {
    const counts = products
      .map((p) => parseDoorCount(p.doorType))
      .filter((n): n is number => n !== null);
    return Array.from(new Set(counts)).sort((a, b) => a - b);
  }, [products]);
  const doorCountOptions = useMemo(
    () => doorCountValues.map((n) => ({ value: String(n), label: t.catalog.doorCountOption(n) })),
    [doorCountValues, t],
  );

  const energyGradeValues = useMemo(() => {
    const grades = products
      .map((p) => parseEnergyGrade(p.energyGrade))
      .filter((n): n is number => n !== null);
    return Array.from(new Set(grades)).sort((a, b) => a - b);
  }, [products]);
  const energyGradeOptions = useMemo(
    () => energyGradeValues.map((n) => ({ value: String(n), label: t.catalog.energyGradeOption(n) })),
    [energyGradeValues, t],
  );

  const capacityRangeKeys = useMemo(() => {
    const litersList = products
      .map((p) => parseCapacityLiters(p.totalCapacity))
      .filter((n): n is number => n !== null);
    return CAPACITY_RANGES.filter((range) => litersList.some(range.test)).map((range) => range.key);
  }, [products]);
  const capacityRangeOptions = useMemo(
    () => capacityRangeKeys.map((key) => ({ value: key, label: t.capacityRanges[key] })),
    [capacityRangeKeys, t],
  );

  const hasWifiData = useMemo(() => products.some((p) => p.wifi !== SPEC_PENDING), [products]);
  const hasIceMakerData = useMemo(() => products.some((p) => p.iceMaker !== SPEC_PENDING), [products]);

  const hasOtherFilters = doorTypeOptions.length > 0 || colorOptions.length > 0;
  const hasAdvancedFilters =
    capacityRangeOptions.length > 0 ||
    energyGradeOptions.length > 0 ||
    doorCountOptions.length > 0 ||
    installationOptions.length > 0 ||
    compressorOptions.length > 0 ||
    hasWifiData ||
    hasIceMakerData;

  // Restore filters from the URL (e.g. a shared link or a page refresh) once, on
  // the client only. Reading window.location (not useSearchParams) keeps the
  // homepage statically prerendered instead of opting it into dynamic rendering.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const brandParam = params.get("brand");
    if (brandParam && brandOptions.includes(brandParam)) {
      // Syncing from the URL (client-only) on mount; SSR renders defaults to
      // avoid a hydration mismatch, so this can't be a lazy useState initializer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBrand(brandParam);
    }

    const qParam = params.get("q");
    if (qParam) {
      setQuery(qParam);
    }

    const sortOption = SORT_SLUGS_REVERSE[params.get("sort") ?? ""];
    if (sortOption) {
      setSort(sortOption);
    }

    const doorTypeParam = params.get("doorType");
    if (doorTypeParam && doorTypeRaw.includes(doorTypeParam)) {
      setDoorType(doorTypeParam);
    }

    const colorParam = params.get("color");
    if (colorParam && colorRaw.includes(colorParam)) {
      setColor(colorParam);
    }

    const installationParam = params.get("installation");
    if (installationParam && installationRaw.includes(installationParam)) {
      setInstallationType(installationParam);
    }

    const compressorParam = params.get("compressor");
    if (compressorParam && compressorRaw.includes(compressorParam)) {
      setCompressor(compressorParam);
    }

    const capacityParam = params.get("capacity");
    if (capacityParam && capacityRangeKeys.includes(capacityParam as CapacityRangeKey)) {
      setCapacityRange(capacityParam);
    }

    const energyParam = params.get("energy");
    if (energyParam && energyGradeValues.includes(Number(energyParam))) {
      setEnergyGrade(energyParam);
    }

    const doorsParam = params.get("doors");
    if (doorsParam && doorCountValues.includes(Number(doorsParam))) {
      setDoorCount(doorsParam);
    }

    if (params.get("wifi") === "1") {
      setWifiOnly(true);
    }
    if (params.get("iceMaker") === "1") {
      setIceMakerOnly(true);
    }

    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync with the active filters (after the initial restore
  // above), so the page can be refreshed or the link shared/reopened as-is.
  useEffect(() => {
    if (!hydrated) return;

    const params = new URLSearchParams();
    if (brand !== ALL) params.set("brand", brand);
    if (query.trim() !== "") params.set("q", query.trim());
    if (sort !== "기본순") params.set("sort", SORT_SLUGS[sort]);
    if (doorType !== ALL) params.set("doorType", doorType);
    if (color !== ALL) params.set("color", color);
    if (installationType !== ALL) params.set("installation", installationType);
    if (compressor !== ALL) params.set("compressor", compressor);
    if (capacityRange !== ALL) params.set("capacity", capacityRange);
    if (energyGrade !== ALL) params.set("energy", energyGrade);
    if (doorCount !== ALL) params.set("doors", doorCount);
    if (wifiOnly) params.set("wifi", "1");
    if (iceMakerOnly) params.set("iceMaker", "1");

    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    hydrated,
    query,
    sort,
    brand,
    doorType,
    color,
    installationType,
    compressor,
    capacityRange,
    energyGrade,
    doorCount,
    wifiOnly,
    iceMakerOnly,
  ]);

  // Lock body scroll and support Escape while the mobile filter drawer is open.
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileFiltersOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFiltersOpen]);

  const isFilterActive =
    query !== "" ||
    sort !== "기본순" ||
    brand !== ALL ||
    doorType !== ALL ||
    color !== ALL ||
    capacityRange !== ALL ||
    energyGrade !== ALL ||
    doorCount !== ALL ||
    wifiOnly ||
    iceMakerOnly ||
    installationType !== ALL ||
    compressor !== ALL;

  const resetFilters = () => {
    setQuery("");
    setSort("기본순");
    setBrand(ALL);
    setDoorType(ALL);
    setColor(ALL);
    setCapacityRange(ALL);
    setEnergyGrade(ALL);
    setDoorCount(ALL);
    setWifiOnly(false);
    setIceMakerOnly(false);
    setInstallationType(ALL);
    setCompressor(ALL);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeRange = capacityRange !== ALL
      ? CAPACITY_RANGES.find((r) => r.key === capacityRange) ?? null
      : null;
    const targetDoorCount = doorCount !== ALL ? Number(doorCount) : null;
    const targetEnergyGrade = energyGrade !== ALL ? Number(energyGrade) : null;

    return products.filter((product) => {
      if (q && !product.model.toLowerCase().includes(q)) return false;
      if (brand !== ALL && product.brand !== brand) return false;
      if (doorType !== ALL && product.doorType !== doorType) return false;
      if (color !== ALL && product.color !== color) return false;
      if (installationType !== ALL && product.installationType !== installationType) return false;
      if (compressor !== ALL && product.compressor !== compressor) return false;
      if (targetEnergyGrade !== null && parseEnergyGrade(product.energyGrade) !== targetEnergyGrade) return false;

      if (activeRange) {
        const liters = parseCapacityLiters(product.totalCapacity);
        if (liters === null || !activeRange.test(liters)) return false;
      }

      if (targetDoorCount !== null && parseDoorCount(product.doorType) !== targetDoorCount) return false;
      if (wifiOnly && !isFeatureSupported(product.wifi)) return false;
      if (iceMakerOnly && !hasIceMaker(product.iceMaker)) return false;

      return true;
    });
  }, [
    products,
    query,
    brand,
    doorType,
    color,
    installationType,
    compressor,
    capacityRange,
    energyGrade,
    doorCount,
    wifiOnly,
    iceMakerOnly,
  ]);

  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);

  const chips = [
    ...(brand !== ALL ? [{ key: "brand", label: brand, onRemove: () => setBrand(ALL) }] : []),
    ...(doorType !== ALL
      ? [{ key: "doorType", label: translateSpecValue(doorType, locale), onRemove: () => setDoorType(ALL) }]
      : []),
    ...(color !== ALL
      ? [{ key: "color", label: translateSpecValue(color, locale), onRemove: () => setColor(ALL) }]
      : []),
    ...(capacityRange !== ALL
      ? [
          {
            key: "capacity",
            label: t.capacityRanges[capacityRange as CapacityRangeKey],
            onRemove: () => setCapacityRange(ALL),
          },
        ]
      : []),
    ...(energyGrade !== ALL
      ? [
          {
            key: "energy",
            label: t.catalog.energyGradeOption(Number(energyGrade)),
            onRemove: () => setEnergyGrade(ALL),
          },
        ]
      : []),
    ...(doorCount !== ALL
      ? [
          {
            key: "doors",
            label: t.catalog.doorCountOption(Number(doorCount)),
            onRemove: () => setDoorCount(ALL),
          },
        ]
      : []),
    ...(wifiOnly ? [{ key: "wifi", label: t.catalog.wifiToggle, onRemove: () => setWifiOnly(false) }] : []),
    ...(iceMakerOnly
      ? [{ key: "iceMaker", label: t.catalog.iceMakerToggle, onRemove: () => setIceMakerOnly(false) }]
      : []),
    ...(installationType !== ALL
      ? [
          {
            key: "installation",
            label: translateSpecValue(installationType, locale),
            onRemove: () => setInstallationType(ALL),
          },
        ]
      : []),
    ...(compressor !== ALL
      ? [
          {
            key: "compressor",
            label: translateSpecValue(compressor, locale),
            onRemove: () => setCompressor(ALL),
          },
        ]
      : []),
  ];

  const advancedFieldProps: AdvancedFilterFieldsProps = {
    t,
    capacityRangeOptions,
    capacityRange,
    onCapacityRangeChange: setCapacityRange,
    energyGradeOptions,
    energyGrade,
    onEnergyGradeChange: setEnergyGrade,
    doorCountOptions,
    doorCount,
    onDoorCountChange: setDoorCount,
    hasWifiData,
    wifiOnly,
    onWifiOnlyChange: setWifiOnly,
    hasIceMakerData,
    iceMakerOnly,
    onIceMakerOnlyChange: setIceMakerOnly,
    installationOptions,
    installationType,
    onInstallationTypeChange: setInstallationType,
    compressorOptions,
    compressor,
    onCompressorChange: setCompressor,
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:mb-10">
        {/* Mobile compact bar: search + filter drawer trigger + sort */}
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              aria-label={t.catalog.searchLabel}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="relative inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-sky-300 hover:text-sky-600"
            >
              <FilterIcon />
              {t.catalog.filterButton}
              {chips.length > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-semibold text-white">
                  {chips.length}
                </span>
              )}
            </button>
            <SortSelect value={sort} onChange={setSort} label={t.catalog.sortLabel} t={t} />
          </div>
        </div>

        {/* Desktop / tablet filter bar */}
        <div className="hidden sm:flex sm:flex-col sm:gap-4">
          {brandOptions.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <BrandSelector
                value={brand}
                options={brandOptions}
                allLabel={t.catalog.all}
                groupLabel={t.catalog.brandGroupLabel}
                onChange={setBrand}
              />
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                aria-label={t.catalog.searchLabel}
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
              />
            </div>

            <SortSelect value={sort} onChange={setSort} label={t.catalog.sortLabel} t={t} />
          </div>

          {hasOtherFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {doorTypeOptions.length > 0 && (
                <FilterSelect
                  label={t.catalog.doorTypeLabel}
                  value={doorType}
                  options={doorTypeOptions}
                  allLabel={t.catalog.all}
                  onChange={setDoorType}
                />
              )}
              {colorOptions.length > 0 && (
                <FilterSelect
                  label={t.catalog.colorLabel}
                  value={color}
                  options={colorOptions}
                  allLabel={t.catalog.all}
                  onChange={setColor}
                />
              )}
            </div>
          )}

          {hasAdvancedFilters && (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                aria-expanded={advancedOpen}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-sky-600 transition-colors hover:text-sky-700"
              >
                {advancedOpen ? t.catalog.hideFilters : t.catalog.moreFilters}
                <ChevronIcon open={advancedOpen} />
              </button>
              {advancedOpen && <AdvancedFilterFields {...advancedFieldProps} />}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="shrink-0 text-xs text-slate-400">{t.catalog.resultCount(sorted.length)}</p>
          {chips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
          ))}
          {isFilterActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-slate-400 underline-offset-2 transition-colors hover:text-sky-600 hover:underline"
            >
              {t.catalog.resetFilters}
            </button>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState onReset={resetFilters} t={t} />
      ) : (
        <div className="flex flex-col gap-10 sm:gap-14 lg:gap-20">
          {sorted.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end bg-slate-900/40 backdrop-blur-sm sm:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.catalog.filtersDrawerTitle}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full flex-col rounded-t-3xl border-t border-slate-200 bg-white shadow-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-heading text-base font-bold text-slate-900">
                {t.catalog.filtersDrawerTitle}
              </h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label={t.catalog.closeFilters}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
              {brandOptions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t.catalog.brandGroupLabel}
                  </span>
                  <BrandSelector
                    value={brand}
                    options={brandOptions}
                    allLabel={t.catalog.all}
                    groupLabel={t.catalog.brandGroupLabel}
                    onChange={setBrand}
                  />
                </div>
              )}

              {hasOtherFilters && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t.catalog.basicFiltersLabel}
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {doorTypeOptions.length > 0 && (
                      <FilterSelect
                        label={t.catalog.doorTypeLabel}
                        value={doorType}
                        options={doorTypeOptions}
                        allLabel={t.catalog.all}
                        onChange={setDoorType}
                      />
                    )}
                    {colorOptions.length > 0 && (
                      <FilterSelect
                        label={t.catalog.colorLabel}
                        value={color}
                        options={colorOptions}
                        allLabel={t.catalog.all}
                        onChange={setColor}
                      />
                    )}
                  </div>
                </div>
              )}

              {hasAdvancedFilters && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {t.catalog.advancedFiltersLabel}
                  </span>
                  <AdvancedFilterFields {...advancedFieldProps} />
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 px-5 py-4">
              {isFilterActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-slate-400 transition-colors hover:text-sky-600 hover:underline"
                >
                  {t.catalog.resetFilters}
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="ml-auto inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
              >
                {t.catalog.viewResults(sorted.length)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
