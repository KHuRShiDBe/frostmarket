export {
  EMPTY_FINDER_ANSWERS,
  FINDER_QUESTION_IDS,
  type BrandPreference,
  type BudgetRangeId,
  type CapacityPreference,
  type CriterionBreakdown,
  type DoorTypePreference,
  type FamilySize,
  type FeatureImportance,
  type FinderAnswers,
  type FinderQuestionId,
  type MatchCriterion,
  type PriorityId,
  type ScoredProduct,
} from "./types";
export {
  BUDGET_RANGE_IDS,
  CAPACITY_PREFERENCE_IDS,
  FAMILY_SIZES,
  getBrandOptions,
  getBudgetRange,
  getCapacityPreferenceRange,
  getDoorTypeOptions,
  getFamilySizeTargetLiters,
  hasIceMakerData,
  hasSmartFeatureData,
} from "./options";
export { getRecommendations, scoreProduct, HARD_FAIL_CAP } from "./recommendationEngine";
export { explainMatch, type MatchExplanation, type MatchReason } from "./explain";
export { describeMatchReason } from "./reasonText";
