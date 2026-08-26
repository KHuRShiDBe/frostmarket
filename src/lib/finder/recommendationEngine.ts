import type { Product } from "@/data/products";
import { SPEC_PENDING } from "@/data/products";
import { hasIceMaker, isFeatureSupported, parseCapacityLiters, parseDoorCount, parseEnergyGrade } from "@/lib/productSpecs";
import { getBudgetRange, getCapacityPreferenceRange, getFamilySizeTargetLiters, type NumericRange } from "./options";
import type { CriterionBreakdown, FinderAnswers, MatchCriterion, PriorityId, ScoredProduct } from "./types";

/**
 * Base weight per scoring criterion (sums to 100 before any Priority-based
 * reweighting). Budget and Capacity are the two hard practical constraints so
 * they carry the most weight; Brand/Door Type are taste; Smart/Ice reflect
 * concrete features; Energy Efficiency is a modest always-on bonus.
 */
const BASE_WEIGHTS: Record<MatchCriterion, number> = {
  budget: 20,
  capacity: 20,
  brand: 12,
  doorType: 10,
  smartFeatures: 15,
  iceMaker: 10,
  energyEfficiency: 13,
};

/** How much the Priority question boosts its associated criterion's weight. */
const PRIORITY_BOOST = 1.8;

const PRIORITY_CRITERION: Partial<Record<PriorityId, MatchCriterion>> = {
  price: "budget",
  capacity: "capacity",
  energy: "energyEfficiency",
  smart: "smartFeatures",
};

/**
 * A product that fails a "required" (hard) preference can never score above
 * this, no matter how well it matches everything else — see spec section 5
 * ("Hard Requirements").
 */
export const HARD_FAIL_CAP = 35;

function weightFor(criterion: MatchCriterion, priority: PriorityId | null): number {
  const base = BASE_WEIGHTS[criterion];
  if (priority && PRIORITY_CRITERION[priority] === criterion) return base * PRIORITY_BOOST;
  return base;
}

/** 1.0 inside the range; falls off linearly outside it, scaled by `falloffScale`. */
function scoreAgainstRange(value: number, range: NumericRange, falloffScale: number): number {
  if (value >= range.min && value < range.max) return 1;
  const distance = value < range.min ? range.min - value : value - range.max;
  return Math.max(0, 1 - distance / falloffScale);
}

/** Deterministic 0-1 match score for one product against one scoring criterion + the raw inputs behind it, for a single product/answers pair. */
export function scoreProduct(product: Product, answers: FinderAnswers): ScoredProduct {
  const breakdown: CriterionBreakdown[] = [];

  // Budget — active only when the shopper picked a specific range.
  {
    const range = answers.budget ? getBudgetRange(answers.budget) : null;
    const active = range !== null;
    const score = active && range ? scoreAgainstRange(product.price, range, 1_500_000) : 0;
    breakdown.push({
      criterion: "budget",
      score,
      weight: weightFor("budget", answers.priority),
      active,
      isHardRequirement: false,
      failedHardRequirement: false,
    });
  }

  // Capacity — always active: explicit preference wins, otherwise family size implies a target.
  {
    const liters = parseCapacityLiters(product.totalCapacity);
    let score = 0.5;
    if (liters !== null) {
      const explicitRange = answers.capacityPreference ? getCapacityPreferenceRange(answers.capacityPreference) : null;
      if (explicitRange) {
        score = scoreAgainstRange(liters, explicitRange, 300);
      } else if (answers.familySize) {
        const target = getFamilySizeTargetLiters(answers.familySize);
        score = Math.max(0, 1 - Math.abs(liters - target) / 450);
      }
    }
    breakdown.push({
      criterion: "capacity",
      score,
      weight: weightFor("capacity", answers.priority),
      active: true,
      isHardRequirement: false,
      failedHardRequirement: false,
    });
  }

  // Brand — active only when the shopper picked a specific brand.
  {
    const active = !!answers.brand && answers.brand !== "any";
    const score = active ? (product.brand === answers.brand ? 1 : 0) : 0;
    breakdown.push({
      criterion: "brand",
      score,
      weight: weightFor("brand", answers.priority),
      active,
      isHardRequirement: false,
      failedHardRequirement: false,
    });
  }

  // Door type — exact match scores best; same door count but different confirmed layout gets partial credit.
  {
    const active = !!answers.doorType && answers.doorType !== "any";
    let score = 0;
    if (active) {
      if (product.doorType === answers.doorType) {
        score = 1;
      } else if (product.doorType !== SPEC_PENDING) {
        const wantCount = parseDoorCount(answers.doorType as string);
        const haveCount = parseDoorCount(product.doorType);
        if (wantCount !== null && haveCount !== null && wantCount === haveCount) score = 0.6;
      }
    }
    breakdown.push({
      criterion: "doorType",
      score,
      weight: weightFor("doorType", answers.priority),
      active,
      isHardRequirement: false,
      failedHardRequirement: false,
    });
  }

  // Smart features (Wi-Fi or SmartThings) — "required" is a hard requirement.
  {
    const pref = answers.smartFeatures;
    const active = !!pref && pref !== "notImportant";
    const has = isFeatureSupported(product.wifi) || isFeatureSupported(product.smartThings);
    const isHardRequirement = pref === "required";
    breakdown.push({
      criterion: "smartFeatures",
      score: active ? (has ? 1 : 0) : 0,
      weight: weightFor("smartFeatures", answers.priority),
      active,
      isHardRequirement,
      failedHardRequirement: isHardRequirement && !has,
    });
  }

  // Ice maker — "required" is a hard requirement.
  {
    const pref = answers.iceMaker;
    const active = !!pref && pref !== "notImportant";
    const has = hasIceMaker(product.iceMaker);
    const isHardRequirement = pref === "required";
    breakdown.push({
      criterion: "iceMaker",
      score: active ? (has ? 1 : 0) : 0,
      weight: weightFor("iceMaker", answers.priority),
      active,
      isHardRequirement,
      failedHardRequirement: isHardRequirement && !has,
    });
  }

  // Energy efficiency — always active; not tied to a dedicated question, just a standing preference for a lower (better) grade.
  {
    const grade = parseEnergyGrade(product.energyGrade);
    const score = grade === 1 ? 1 : grade === 2 ? 0.65 : grade === 3 ? 0.35 : 0.5;
    breakdown.push({
      criterion: "energyEfficiency",
      score,
      weight: weightFor("energyEfficiency", answers.priority),
      active: true,
      isHardRequirement: false,
      failedHardRequirement: false,
    });
  }

  const activeCriteria = breakdown.filter((c) => c.active);
  const totalWeight = activeCriteria.reduce((sum, c) => sum + c.weight, 0);
  const weightedScore =
    totalWeight > 0 ? activeCriteria.reduce((sum, c) => sum + c.weight * c.score, 0) / totalWeight : 0;

  const failedAnyHardRequirement = breakdown.some((c) => c.failedHardRequirement);
  let matchPercent = Math.round(weightedScore * 100);
  if (failedAnyHardRequirement) matchPercent = Math.min(matchPercent, HARD_FAIL_CAP);

  return { productId: product.id, matchPercent, breakdown, failedAnyHardRequirement };
}

/**
 * Scores every product and sorts best-first. Products meeting every hard
 * requirement always rank above those that don't, regardless of raw score —
 * see HARD_FAIL_CAP. Same answers always produce the same order (pure
 * function, no randomness).
 */
export function getRecommendations(products: Product[], answers: FinderAnswers): ScoredProduct[] {
  return products
    .map((product) => scoreProduct(product, answers))
    .sort((a, b) => {
      if (a.failedAnyHardRequirement !== b.failedAnyHardRequirement) {
        return a.failedAnyHardRequirement ? 1 : -1;
      }
      return b.matchPercent - a.matchPercent;
    });
}
