"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { translateSpecValue, type Locale, type TranslationDict } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { formatPriceKRW } from "@/lib/currency";
import {
  BUDGET_RANGE_IDS,
  CAPACITY_PREFERENCE_IDS,
  EMPTY_FINDER_ANSWERS,
  FAMILY_SIZES,
  getBrandOptions,
  getBudgetRange,
  getDoorTypeOptions,
  hasIceMakerData,
  hasSmartFeatureData,
  type FinderAnswers,
  type FinderQuestionId,
} from "@/lib/finder";
import FinderProgress from "./FinderProgress";
import FinderQuestionCard, { type FinderOption } from "./FinderQuestionCard";
import FinderResults from "./FinderResults";

interface FinderQuestionConfig {
  id: FinderQuestionId;
  title: string;
  options: FinderOption[];
}

const FEATURE_IMPORTANCE_IDS = ["required", "nice", "notImportant"] as const;
const PRIORITY_IDS = ["price", "capacity", "energy", "smart", "balance"] as const;

function brandLabel(brand: string, t: TranslationDict): string {
  if (brand === "LG") return t.finder.questions.brand.options.LG;
  if (brand === "Samsung") return t.finder.questions.brand.options.Samsung;
  return brand;
}

function buildQuestions(products: Product[], t: TranslationDict, locale: Locale): FinderQuestionConfig[] {
  const questions: FinderQuestionConfig[] = [];

  const budgetOptions: FinderOption[] = [];
  for (const id of BUDGET_RANGE_IDS) {
    const range = getBudgetRange(id);
    if (!range) continue;
    const minStr = formatPriceKRW(range.min);
    const maxStr = range.max === Infinity ? "" : formatPriceKRW(range.max);
    budgetOptions.push({ value: id, label: t.finder.questions.budget.options[id](minStr, maxStr) });
  }
  budgetOptions.push({ value: "any", label: t.finder.questions.budget.options.any });
  questions.push({ id: "budget", title: t.finder.questions.budget.title, options: budgetOptions });

  questions.push({
    id: "familySize",
    title: t.finder.questions.familySize.title,
    options: FAMILY_SIZES.map((size) => ({ value: size, label: t.finder.questions.familySize.options[size] })),
  });

  questions.push({
    id: "capacityPreference",
    title: t.finder.questions.capacityPreference.title,
    options: [
      ...CAPACITY_PREFERENCE_IDS.map((id) => ({ value: id, label: t.finder.questions.capacityPreference.options[id] })),
      { value: "auto", label: t.finder.questions.capacityPreference.options.auto },
    ],
  });

  const brandOptions = getBrandOptions(products);
  if (brandOptions.length > 0) {
    questions.push({
      id: "brand",
      title: t.finder.questions.brand.title,
      options: [
        ...brandOptions.map((brand) => ({ value: brand, label: brandLabel(brand, t) })),
        { value: "any", label: t.finder.questions.brand.options.any },
      ],
    });
  }

  const doorTypeOptions = getDoorTypeOptions(products);
  if (doorTypeOptions.length > 0) {
    questions.push({
      id: "doorType",
      title: t.finder.questions.doorType.title,
      options: [
        ...doorTypeOptions.map((doorType) => ({ value: doorType, label: translateSpecValue(doorType, locale) })),
        { value: "any", label: t.finder.questions.doorType.anyOption },
      ],
    });
  }

  if (hasSmartFeatureData(products)) {
    questions.push({
      id: "smartFeatures",
      title: t.finder.questions.smartFeatures.title,
      options: FEATURE_IMPORTANCE_IDS.map((id) => ({ value: id, label: t.finder.questions.smartFeatures.options[id] })),
    });
  }

  if (hasIceMakerData(products)) {
    questions.push({
      id: "iceMaker",
      title: t.finder.questions.iceMaker.title,
      options: FEATURE_IMPORTANCE_IDS.map((id) => ({ value: id, label: t.finder.questions.iceMaker.options[id] })),
    });
  }

  questions.push({
    id: "priority",
    title: t.finder.questions.priority.title,
    options: PRIORITY_IDS.map((id) => ({ value: id, label: t.finder.questions.priority.options[id] })),
  });

  return questions;
}

export default function FinderWizard({ products: initialProducts }: { products: Product[] }) {
  const { t, locale } = useLocale();
  const products = useCatalogProducts(initialProducts);
  const [phase, setPhase] = useState<"wizard" | "results">("wizard");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>(EMPTY_FINDER_ANSWERS);

  const questions = useMemo(() => buildQuestions(products, t, locale), [products, t, locale]);

  if (phase === "results") {
    return (
      <FinderResults
        products={products}
        answers={answers}
        onModify={() => {
          setStepIndex(0);
          setPhase("wizard");
        }}
        onRestart={() => {
          setAnswers(EMPTY_FINDER_ANSWERS);
          setStepIndex(0);
          setPhase("wizard");
        }}
      />
    );
  }

  const totalSteps = questions.length;
  const boundedStepIndex = Math.min(stepIndex, totalSteps - 1);
  const currentQuestion = questions[boundedStepIndex];
  const currentAnswer = answers[currentQuestion.id];
  const isLastStep = boundedStepIndex === totalSteps - 1;

  const selectAnswer = (value: string) => {
    // Each question's options are constrained to that field's own union at
    // build time (see buildQuestions); the cast just satisfies the compiler
    // for this one dynamic-key update.
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }) as FinderAnswers);
  };

  const goNext = () => {
    if (isLastStep) {
      setPhase("results");
    } else {
      setStepIndex((i) => Math.min(totalSteps - 1, i + 1));
    }
  };

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setAnswers(EMPTY_FINDER_ANSWERS);
    setStepIndex(0);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <FinderProgress current={boundedStepIndex + 1} total={totalSteps} />

        <FinderQuestionCard
          title={currentQuestion.title}
          options={currentQuestion.options}
          selectedValue={currentAnswer}
          onSelect={selectAnswer}
        />

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={boundedStepIndex === 0}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.finder.back}
          </button>

          <button
            type="button"
            onClick={restart}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-rose-500"
          >
            {t.finder.restart}
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!currentAnswer}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLastStep ? t.finder.seeResults : t.finder.next}
          </button>
        </div>
      </div>
    </div>
  );
}
