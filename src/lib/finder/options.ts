import type { Product } from "@/data/products";
import { SPEC_PENDING } from "@/data/products";
import type { BudgetRangeId, CapacityPreference, FamilySize } from "./types";

export interface NumericRange {
  min: number;
  max: number;
}

/** Real-data-derived price buckets. See types.ts for why these specific thresholds. */
const BUDGET_RANGES: Record<Exclude<BudgetRangeId, "any">, NumericRange> = {
  under1_5m: { min: 0, max: 1_500_000 },
  "1_5to2_9m": { min: 1_500_000, max: 2_900_000 },
  "2_9to4m": { min: 2_900_000, max: 4_000_000 },
  "4mPlus": { min: 4_000_000, max: Infinity },
};

export const BUDGET_RANGE_IDS: Exclude<BudgetRangeId, "any">[] = [
  "under1_5m",
  "1_5to2_9m",
  "2_9to4m",
  "4mPlus",
];

export function getBudgetRange(id: BudgetRangeId): NumericRange | null {
  if (id === "any") return null;
  return BUDGET_RANGES[id];
}

const CAPACITY_PREFERENCE_RANGES: Record<Exclude<CapacityPreference, "auto">, NumericRange> = {
  compact: { min: 0, max: 400 },
  medium: { min: 400, max: 700 },
  large: { min: 700, max: 900 },
  extraLarge: { min: 900, max: Infinity },
};

export const CAPACITY_PREFERENCE_IDS: Exclude<CapacityPreference, "auto">[] = [
  "compact",
  "medium",
  "large",
  "extraLarge",
];

export function getCapacityPreferenceRange(pref: CapacityPreference): NumericRange | null {
  if (pref === "auto") return null;
  return CAPACITY_PREFERENCE_RANGES[pref];
}

export const FAMILY_SIZES: FamilySize[] = ["1-2", "3-4", "5-6", "7+"];

/** Ideal total-capacity midpoint (liters) per family size, used when the shopper has no explicit capacity preference. */
const FAMILY_SIZE_TARGET_LITERS: Record<FamilySize, number> = {
  "1-2": 380,
  "3-4": 550,
  "5-6": 800,
  "7+": 950,
};

export function getFamilySizeTargetLiters(size: FamilySize): number {
  return FAMILY_SIZE_TARGET_LITERS[size];
}

/** Distinct, confirmed brands present in the catalog (never invented). */
export function getBrandOptions(products: Product[]): string[] {
  const values = new Set(products.map((p) => p.brand).filter((v) => v && v !== SPEC_PENDING));
  return Array.from(values).sort();
}

/** Distinct, confirmed door types present in the catalog (never invented). */
export function getDoorTypeOptions(products: Product[]): string[] {
  const values = new Set(products.map((p) => p.doorType).filter((v) => v && v !== SPEC_PENDING));
  return Array.from(values).sort((a, b) => a.localeCompare(b, "ko"));
}

/** Whether any product in the catalog has confirmed Wi-Fi/SmartThings data, gating the Smart Features question. */
export function hasSmartFeatureData(products: Product[]): boolean {
  return products.some((p) => p.wifi !== SPEC_PENDING || p.smartThings !== SPEC_PENDING);
}

/** Whether any product in the catalog has confirmed ice maker data, gating the Ice Maker question. */
export function hasIceMakerData(products: Product[]): boolean {
  return products.some((p) => p.iceMaker !== SPEC_PENDING);
}
