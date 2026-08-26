/**
 * Budget buckets chosen from the real spread of `price` values in the current
 * catalog (990,000 - 4,990,000 KRW), not generic round numbers, so every
 * bucket actually contains products. "any" means the shopper doesn't want
 * price to constrain the recommendation at all.
 */
export type BudgetRangeId = "any" | "under1_5m" | "1_5to2_9m" | "2_9to4m" | "4mPlus";

export type FamilySize = "1-2" | "3-4" | "5-6" | "7+";

export type CapacityPreference = "compact" | "medium" | "large" | "extraLarge" | "auto";

export type BrandPreference = "LG" | "Samsung" | "any";

/** Either the sentinel "any", or one of the real, confirmed `doorType` values from the catalog. */
export type DoorTypePreference = string;

export type FeatureImportance = "required" | "nice" | "notImportant";

export type PriorityId = "price" | "capacity" | "energy" | "smart" | "balance";

export interface FinderAnswers {
  budget: BudgetRangeId | null;
  familySize: FamilySize | null;
  capacityPreference: CapacityPreference | null;
  brand: BrandPreference | null;
  doorType: DoorTypePreference | null;
  smartFeatures: FeatureImportance | null;
  iceMaker: FeatureImportance | null;
  priority: PriorityId | null;
}

export const EMPTY_FINDER_ANSWERS: FinderAnswers = {
  budget: null,
  familySize: null,
  capacityPreference: null,
  brand: null,
  doorType: null,
  smartFeatures: null,
  iceMaker: null,
  priority: null,
};

export const FINDER_QUESTION_IDS = [
  "budget",
  "familySize",
  "capacityPreference",
  "brand",
  "doorType",
  "smartFeatures",
  "iceMaker",
  "priority",
] as const;

export type FinderQuestionId = (typeof FINDER_QUESTION_IDS)[number];

/** One weighted scoring criterion's contribution to a product's overall match. */
export type MatchCriterion =
  | "budget"
  | "capacity"
  | "brand"
  | "doorType"
  | "smartFeatures"
  | "iceMaker"
  | "energyEfficiency";

export interface CriterionBreakdown {
  criterion: MatchCriterion;
  /** 0-1, how well this product satisfies this criterion. */
  score: number;
  /** This criterion's weight after Priority-based reweighting, before normalization. */
  weight: number;
  /** False when the user expressed no preference for this criterion (excluded from scoring). */
  active: boolean;
  /** True when this was a "required" (hard) preference, not just a soft one. */
  isHardRequirement: boolean;
  /** True when a hard requirement was NOT met by this product. */
  failedHardRequirement: boolean;
}

export interface ScoredProduct {
  productId: string;
  /** 0-100, the final Match percentage shown to the user. */
  matchPercent: number;
  breakdown: CriterionBreakdown[];
  failedAnyHardRequirement: boolean;
}
