import { SPEC_PENDING, type Product } from "@/data/products";
import type { TranslationDict } from "@/i18n";

/** Extracts the first numeric token from a spec string (e.g. "507 L" -> 507). */
function parseNumber(raw: string): number | null {
  if (!raw || raw === SPEC_PENDING) return null;
  const match = raw.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

/** Parses a Korean warranty/duration string ("1년 6개월", "2년") into total months. */
function parseDurationMonths(raw: string): number | null {
  if (!raw || raw === SPEC_PENDING) return null;
  const years = raw.match(/(\d+(?:\.\d+)?)\s*년/);
  const months = raw.match(/(\d+(?:\.\d+)?)\s*(?:개월|달)/);
  if (!years && !months) return null;
  let total = 0;
  if (years) total += Number(years[1]) * 12;
  if (months) total += Number(months[1]);
  return total;
}

/** Splits the combined "W × H × D unit" dimensions string into its three parts. */
function parseDimensions(raw: string): { width: string; height: string; depth: string } | null {
  if (!raw || raw === SPEC_PENDING) return null;
  const parts = raw.split("×").map((part) => part.trim());
  if (parts.length !== 3) return null;
  const unitMatch = parts[2].match(/[a-zA-Z]+$/);
  const unit = unitMatch ? unitMatch[0] : "";
  const stripUnit = (part: string) => part.replace(/[a-zA-Z]+$/, "").trim();
  return {
    width: unit ? `${stripUnit(parts[0])} ${unit}` : parts[0],
    height: unit ? `${stripUnit(parts[1])} ${unit}` : parts[1],
    depth: unit ? `${stripUnit(parts[2])} ${unit}` : parts[2],
  };
}

type SpecLabelKey = keyof TranslationDict["specLabels"];
type SpecSectionKey = keyof TranslationDict["specSections"];

export interface CompareRow {
  labelKey: SpecLabelKey;
  /** Raw (Korean) value, used for numeric parsing and equality checks; translated only at display time. */
  get: (product: Product) => string;
  /** Set only when a lower/higher value is objectively better; omit for subjective specs. */
  best?: "higher" | "lower";
  parse?: (raw: string) => number | null;
}

export interface CompareSection {
  titleKey: SpecSectionKey;
  rows: CompareRow[];
}

const dimensionValue = (product: Product, key: "width" | "height" | "depth") =>
  parseDimensions(product.dimensions)?.[key] ?? SPEC_PENDING;

export const COMPARE_SECTIONS: CompareSection[] = [
  {
    titleKey: "overview",
    rows: [
      { labelKey: "brand", get: (p) => p.brand },
      { labelKey: "model", get: (p) => p.model },
      { labelKey: "productName", get: (p) => p.productName },
      { labelKey: "color", get: (p) => p.color },
    ],
  },
  {
    titleKey: "capacity",
    rows: [
      { labelKey: "totalCapacity", get: (p) => p.totalCapacity, best: "higher" },
      { labelKey: "fridgeCapacity", get: (p) => p.fridgeCapacity, best: "higher" },
      { labelKey: "freezerCapacity", get: (p) => p.freezerCapacity, best: "higher" },
    ],
  },
  {
    titleKey: "dimensionsWeight",
    rows: [
      { labelKey: "width", get: (p) => dimensionValue(p, "width") },
      { labelKey: "height", get: (p) => dimensionValue(p, "height") },
      { labelKey: "depth", get: (p) => dimensionValue(p, "depth") },
      { labelKey: "weight", get: (p) => p.weight },
    ],
  },
  {
    titleKey: "doorsDesign",
    rows: [
      { labelKey: "doorType", get: (p) => p.doorType },
      { labelKey: "doorDesign", get: (p) => p.doorDesign },
      { labelKey: "doorMaterial", get: (p) => p.doorMaterial },
      { labelKey: "handleType", get: (p) => p.handleType },
    ],
  },
  {
    titleKey: "energyPerformance",
    rows: [
      { labelKey: "energyGrade", get: (p) => p.energyGrade, best: "lower" },
      { labelKey: "monthlyPowerConsumption", get: (p) => p.monthlyPowerConsumption, best: "lower" },
      { labelKey: "compressor", get: (p) => p.compressor },
      { labelKey: "coolingType", get: (p) => p.coolingType },
      { labelKey: "refrigerant", get: (p) => p.refrigerant },
      { labelKey: "noiseLevel", get: (p) => p.noiseLevel, best: "lower" },
      { labelKey: "ratedVoltage", get: (p) => p.ratedVoltage },
    ],
  },
  {
    titleKey: "smartFeatures",
    rows: [
      { labelKey: "wifi", get: (p) => p.wifi },
      { labelKey: "smartThings", get: (p) => p.smartThings },
      { labelKey: "bixby", get: (p) => p.bixby },
      { labelKey: "smartDiagnosis", get: (p) => p.smartDiagnosis },
      { labelKey: "autoDoorOpen", get: (p) => p.autoDoorOpen },
      { labelKey: "aiVisionInside", get: (p) => p.aiVisionInside },
      { labelKey: "upAppliance", get: (p) => p.upAppliance },
    ],
  },
  {
    titleKey: "iceDispenser",
    rows: [
      { labelKey: "iceMaker", get: (p) => p.iceMaker },
      { labelKey: "iceType", get: (p) => p.iceType },
      { labelKey: "dispenser", get: (p) => p.dispenser },
      { labelKey: "beverageZone", get: (p) => p.beverageZone },
    ],
  },
  {
    titleKey: "interior",
    rows: [
      { labelKey: "interiorLighting", get: (p) => p.interiorLighting },
      { labelKey: "foodShowcase", get: (p) => p.foodShowcase },
      { labelKey: "transparentShowcase", get: (p) => p.transparentShowcase },
      { labelKey: "deodorizing", get: (p) => p.deodorizing },
      { labelKey: "layoutType", get: (p) => p.layoutType },
      { labelKey: "magicSpace", get: (p) => p.magicSpace },
    ],
  },
  {
    titleKey: "otherInfo",
    rows: [
      { labelKey: "installationType", get: (p) => p.installationType },
      { labelKey: "material", get: (p) => p.material },
      { labelKey: "warranty", get: (p) => p.warranty, best: "higher", parse: parseDurationMonths },
      { labelKey: "countryOfOrigin", get: (p) => p.countryOfOrigin },
      { labelKey: "manufacturer", get: (p) => p.manufacturer },
      { labelKey: "releaseInfo", get: (p) => p.releaseInfo },
      {
        labelKey: "keyFeatures",
        get: (p) => (p.keyFeatures.length > 0 ? p.keyFeatures.join(", ") : SPEC_PENDING),
      },
      { labelKey: "notes", get: (p) => p.notes || SPEC_PENDING },
    ],
  },
];

/** Ids of products holding the objectively best value for this row, or an empty set if not determinable. */
export function getBestProductIds(row: CompareRow, products: Product[]): Set<string> {
  if (!row.best) return new Set();

  const parser = row.parse ?? parseNumber;
  const parsed = products.map((product) => ({
    id: product.id,
    value: parser(row.get(product)),
  }));

  if (parsed.some((entry) => entry.value === null)) return new Set();

  const values = parsed.map((entry) => entry.value as number);
  const allEqual = values.every((value) => value === values[0]);
  if (allEqual) return new Set();

  const extreme = row.best === "higher" ? Math.max(...values) : Math.min(...values);
  return new Set(parsed.filter((entry) => entry.value === extreme).map((entry) => entry.id));
}

/** Whether every selected product shares the exact same (raw) value for this row. */
export function rowValuesAreIdentical(row: CompareRow, products: Product[]): boolean {
  if (products.length === 0) return true;
  const first = row.get(products[0]);
  return products.every((product) => row.get(product) === first);
}
