import type { TranslationDict } from "@/i18n";
import type { MatchReason } from "./explain";

/** Maps a reason code from the (string-free) scoring engine to localized display text. */
export function describeMatchReason(reason: MatchReason, t: TranslationDict): string {
  switch (reason.type) {
    case "budgetFit":
      return t.finder.reasons.budgetFit;
    case "budgetOver":
      return t.finder.reasons.budgetOver;
    case "capacityFamilyFit":
      return t.finder.reasons.capacityFamilyFit(t.finder.questions.familySize.options[reason.familySize]);
    case "capacityPreferenceFit":
      return t.finder.reasons.capacityPreferenceFit(t.finder.questions.capacityPreference.options[reason.preference]);
    case "capacityMismatch":
      return t.finder.reasons.capacityMismatch;
    case "brandMatch":
      return t.finder.reasons.brandMatch(reason.brand);
    case "brandMismatch":
      return t.finder.reasons.brandMismatch(reason.brand);
    case "doorTypeMatch":
      return t.finder.reasons.doorTypeMatch;
    case "doorTypeMismatch":
      return t.finder.reasons.doorTypeMismatch;
    case "smartFeaturesYes":
      return t.finder.reasons.smartFeaturesYes;
    case "smartFeaturesMissingRequired":
      return t.finder.reasons.smartFeaturesMissingRequired;
    case "smartFeaturesMissing":
      return t.finder.reasons.smartFeaturesMissing;
    case "iceMakerYes":
      return t.finder.reasons.iceMakerYes;
    case "iceMakerMissingRequired":
      return t.finder.reasons.iceMakerMissingRequired;
    case "iceMakerMissing":
      return t.finder.reasons.iceMakerMissing;
    case "energyTopGrade":
      return t.finder.reasons.energyTopGrade;
    case "energyLowGrade":
      return t.finder.reasons.energyLowGrade;
  }
}
