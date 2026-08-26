import type { Product } from "@/data/products";
import { parseEnergyGrade } from "@/lib/productSpecs";
import { getBudgetRange } from "./options";
import type { CapacityPreference, CriterionBreakdown, FamilySize, FinderAnswers, ScoredProduct } from "./types";

/**
 * A single "why it matches" / "trade-off" reason, as data — never a display
 * string. The UI (ReviewsSection-style) maps `type` to localized copy via
 * the existing i18n system, so this stays translation-agnostic and testable.
 */
export type MatchReason =
  | { type: "budgetFit" }
  | { type: "budgetOver" }
  | { type: "capacityFamilyFit"; familySize: FamilySize }
  | { type: "capacityPreferenceFit"; preference: Exclude<CapacityPreference, "auto"> }
  | { type: "capacityMismatch" }
  | { type: "brandMatch"; brand: string }
  | { type: "brandMismatch"; brand: string }
  | { type: "doorTypeMatch" }
  | { type: "doorTypeMismatch" }
  | { type: "smartFeaturesYes" }
  | { type: "smartFeaturesMissingRequired" }
  | { type: "smartFeaturesMissing" }
  | { type: "iceMakerYes" }
  | { type: "iceMakerMissingRequired" }
  | { type: "iceMakerMissing" }
  | { type: "energyTopGrade" }
  | { type: "energyLowGrade" };

export interface MatchExplanation {
  pros: MatchReason[];
  cons: MatchReason[];
}

function findCriterion(breakdown: CriterionBreakdown[], criterion: CriterionBreakdown["criterion"]) {
  return breakdown.find((c) => c.criterion === criterion);
}

/**
 * Derives "why this matches" / trade-off reasons straight from the same
 * per-criterion scores the engine computed — never a separate, hand-written
 * explanation that could drift from the actual score.
 */
export function explainMatch(product: Product, answers: FinderAnswers, scored: ScoredProduct): MatchExplanation {
  const pros: MatchReason[] = [];
  const cons: MatchReason[] = [];

  const budget = findCriterion(scored.breakdown, "budget");
  if (budget?.active && answers.budget) {
    if (budget.score >= 1) {
      pros.push({ type: "budgetFit" });
    } else {
      const range = getBudgetRange(answers.budget);
      if (range && product.price > range.max) cons.push({ type: "budgetOver" });
    }
  }

  const capacity = findCriterion(scored.breakdown, "capacity");
  if (capacity) {
    if (capacity.score >= 0.75) {
      if (answers.capacityPreference && answers.capacityPreference !== "auto") {
        pros.push({ type: "capacityPreferenceFit", preference: answers.capacityPreference });
      } else if (answers.familySize) {
        pros.push({ type: "capacityFamilyFit", familySize: answers.familySize });
      }
    } else if (capacity.score < 0.5) {
      cons.push({ type: "capacityMismatch" });
    }
  }

  const brand = findCriterion(scored.breakdown, "brand");
  if (brand?.active && answers.brand && answers.brand !== "any") {
    if (brand.score >= 1) pros.push({ type: "brandMatch", brand: product.brand });
    else cons.push({ type: "brandMismatch", brand: answers.brand });
  }

  const doorType = findCriterion(scored.breakdown, "doorType");
  if (doorType?.active) {
    if (doorType.score >= 1) pros.push({ type: "doorTypeMatch" });
    else cons.push({ type: "doorTypeMismatch" });
  }

  const smartFeatures = findCriterion(scored.breakdown, "smartFeatures");
  if (smartFeatures?.active) {
    if (smartFeatures.score >= 1) {
      pros.push({ type: "smartFeaturesYes" });
    } else if (smartFeatures.isHardRequirement) {
      cons.push({ type: "smartFeaturesMissingRequired" });
    } else {
      cons.push({ type: "smartFeaturesMissing" });
    }
  }

  const iceMaker = findCriterion(scored.breakdown, "iceMaker");
  if (iceMaker?.active) {
    if (iceMaker.score >= 1) {
      pros.push({ type: "iceMakerYes" });
    } else if (iceMaker.isHardRequirement) {
      cons.push({ type: "iceMakerMissingRequired" });
    } else {
      cons.push({ type: "iceMakerMissing" });
    }
  }

  const grade = parseEnergyGrade(product.energyGrade);
  if (grade === 1) pros.push({ type: "energyTopGrade" });
  else if (grade === 3) cons.push({ type: "energyLowGrade" });

  return { pros, cons };
}
