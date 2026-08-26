import { SPEC_PENDING } from "@/data/products";

/** Extracts a leading number from a spec string (e.g. "507 L" -> 507). */
export function parseCapacityLiters(capacity: string): number | null {
  if (!capacity || capacity === SPEC_PENDING) return null;
  const match = capacity.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

/** Extracts the door count from a door-type string (e.g. "2도어 / 상냉동·하냉장" -> 2). */
export function parseDoorCount(doorType: string): number | null {
  if (!doorType || doorType === SPEC_PENDING) return null;
  const match = doorType.match(/(\d+)\s*도어/);
  return match ? Number(match[1]) : null;
}

/** Extracts the energy grade number from a grade string (e.g. "1등급" -> 1). */
export function parseEnergyGrade(energyGrade: string): number | null {
  if (!energyGrade || energyGrade === SPEC_PENDING) return null;
  const match = energyGrade.match(/(\d+)\s*등급/);
  return match ? Number(match[1]) : null;
}

/** Whether a "지원 여부" style spec field (Wi-Fi, SmartThings, ...) confirms real support. */
export function isFeatureSupported(value: string): boolean {
  return value !== SPEC_PENDING && value.includes("지원") && !value.includes("안 함") && !value.includes("안함");
}

/** Whether a product's ice maker field confirms it actually has one. */
export function hasIceMaker(iceMaker: string): boolean {
  return iceMaker !== SPEC_PENDING && iceMaker !== "" && iceMaker !== "없음";
}

export type CapacityRangeKey = "under400" | "from400to700" | "from700to900" | "plus900";

/**
 * Capacity buckets chosen from the real spread of `totalCapacity` values in the
 * current catalog (roughly: 317-349L, 507L, 602-651L, 832-902L) rather than the
 * generic 100L-wide bands, so every bucket actually contains products.
 */
export const CAPACITY_RANGES: { key: CapacityRangeKey; test: (liters: number) => boolean }[] = [
  { key: "under400", test: (n) => n < 400 },
  { key: "from400to700", test: (n) => n >= 400 && n < 700 },
  { key: "from700to900", test: (n) => n >= 700 && n < 900 },
  { key: "plus900", test: (n) => n >= 900 },
];
