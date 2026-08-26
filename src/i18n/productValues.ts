import { SPEC_PENDING, type Product } from "@/data/products";
import type { Locale } from "./locale";
import { translations, type TranslationDict } from "./translations";

const PENDING_LABEL: Record<Locale, string> = {
  ko: SPEC_PENDING,
  ru: "Уточняется",
  en: "Pending",
};

/**
 * Real, confirmed Korean spec values found in the current product catalog,
 * mapped to natural RU/EN equivalents. Anything not listed here falls back to
 * the original Korean text rather than being guessed at.
 */
const VALUE_DICTIONARY: Record<string, { ru: string; en: string }> = {
  // Colors
  "네이처 베이지": { ru: "Бежевый Nature", en: "Nature Beige" },
  샤인: { ru: "Shine", en: "Shine" },
  "에센셜 화이트": { ru: "Белый Essential", en: "Essential White" },
  "오브제컬렉션 베이지": { ru: "Бежевый Objet Collection", en: "Objet Collection Beige" },
  "오브제컬렉션 베이지 / 베이지": {
    ru: "Бежевый Objet Collection / бежевый",
    en: "Objet Collection Beige / Beige",
  },
  "오브제컬렉션 클레이 브라운": {
    ru: "Коричневый Objet Collection Clay Brown",
    en: "Objet Collection Clay Brown",
  },
  "코타 화이트": { ru: "Белый Cotta", en: "Cotta White" },
  "코타 PCM 화이트 (메탈)": { ru: "Белый Cotta PCM (металл)", en: "Cotta PCM White (Metal)" },
  클린화이트: { ru: "Чистый белый", en: "Clean White" },

  // Door types
  "2도어": { ru: "2 двери", en: "2-Door" },
  "2도어 / 상냉동·하냉장": { ru: "2 двери (морозильная камера сверху)", en: "2-Door (Top Freezer)" },
  "2도어 / 양문형": { ru: "2 двери / Side-by-Side", en: "2-Door / Side-by-Side" },
  "4도어": { ru: "4 двери", en: "4-Door" },
  양문형: { ru: "Side-by-Side", en: "Side-by-Side" },
  "양문형 / 2도어": { ru: "Side-by-Side / 2 двери", en: "Side-by-Side / 2-Door" },

  // Energy grades
  "1등급": { ru: "Класс 1", en: "Grade 1" },
  "2등급": { ru: "Класс 2", en: "Grade 2" },
  "3등급": { ru: "Класс 3", en: "Grade 3" },

  // Installation types
  프리스탠딩: { ru: "Отдельностоящий", en: "Freestanding" },
  "키친핏 Max": { ru: "Kitchen Fit Max", en: "Kitchen Fit Max" },
  "빌트인 타입": { ru: "Встраиваемый", en: "Built-in" },

  // Compressors
  "인버터 컴프레서": { ru: "Инверторный компрессор", en: "Inverter Compressor" },
  "인버터 리니어 컴프레서": { ru: "Инверторный линейный компрессор", en: "Inverter Linear Compressor" },
  "AI 인버터 컴프레서": { ru: "AI-инверторный компрессор", en: "AI Inverter Compressor" },

  // Support / presence states
  지원: { ru: "Поддерживается", en: "Supported" },
  "지원 (ThinQ)": { ru: "Поддерживается (ThinQ)", en: "Supported (ThinQ)" },
  "지원 안 함 (ThinQ)": { ru: "Не поддерживается (ThinQ)", en: "Not Supported (ThinQ)" },
  없음: { ru: "Нет", en: "None" },
  있음: { ru: "Есть", en: "Yes" },
  "있음 (좌)": { ru: "Есть (слева)", en: "Yes (Left)" },

  // Ice makers
  "트위스트 아이스메이커": { ru: "Твист-льдогенератор", en: "Twist Ice Maker" },
  "아이스 트레이": { ru: "Форма для льда", en: "Ice Tray" },
  "무빙 도어 아이스메이커": { ru: "Льдогенератор с подвижной дверцей", en: "Moving Door Ice Maker" },
  "빅 아이스메이커": { ru: "Большой льдогенератор", en: "Big Ice Maker" },
  "빅 아이스메이커 + 아이스 트레이": {
    ru: "Большой льдогенератор + форма для льда",
    en: "Big Ice Maker + Ice Tray",
  },

  // Door design / material / handle
  "플랫 도어": { ru: "Плоская дверь", en: "Flat Door" },
  "푸드쇼케이스 (메탈쿨링도어)": {
    ru: "Фуд-шоукейс (металлическая охлаждающая дверь)",
    en: "Food Showcase (Metal Cooling Door)",
  },
  "네이처 (메탈)": { ru: "Nature (металл)", en: "Nature (Metal)" },
  메탈: { ru: "Металл", en: "Metal" },
  글라스: { ru: "Стекло", en: "Glass" },
  "포켓 핸들": { ru: "Утопленная ручка", en: "Pocket Handle" },
  포켓핸들: { ru: "Утопленная ручка", en: "Pocket Handle" },
  바핸들: { ru: "Ручка-бар", en: "Bar Handle" },
  "스퀘어 핸들": { ru: "Квадратная ручка", en: "Square Handle" },

  // Cooling / refrigerant / material / ice type
  멀티냉각방식: { ru: "Мультиохлаждение", en: "Multi Cooling" },
  멀티냉각: { ru: "Мультиохлаждение", en: "Multi Cooling" },
  "AI 하이브리드 쿨링 (컴프레서 + 펠티어 소자)": {
    ru: "AI гибридное охлаждение (компрессор + элемент Пельтье)",
    en: "AI Hybrid Cooling (Compressor + Peltier)",
  },
  "AI 하이브리드 쿨링": { ru: "AI гибридное охлаждение", en: "AI Hybrid Cooling" },
  더블냉각: { ru: "Двойное охлаждение", en: "Double Cooling" },
  "에센셜 메탈": { ru: "Essential металл", en: "Essential Metal" },
  큐브: { ru: "Кубик", en: "Cube" },
  "위스키볼 + 큐브": { ru: "Шар для виски + кубик", en: "Whiskey Ball + Cube" },

  // Deodorizing / display / layout / magic space
  "퓨어 프레시 필터": { ru: "Фильтр Pure Fresh", en: "Pure Fresh Filter" },
  "UV 청정탈취": { ru: "УФ-очистка и устранение запахов", en: "UV Sterilization & Deodorizing" },
  '9" AI 홈': { ru: '9" AI Home', en: '9" AI Home' },
  '9" 패밀리허브': { ru: '9" Family Hub', en: '9" Family Hub' },
  "상냉장 / 하냉동": {
    ru: "Холодильная камера сверху / морозильная снизу",
    en: "Top Fridge / Bottom Freezer",
  },
  "더블 매직스페이스": { ru: "Double Magic Space", en: "Double Magic Space" },

  // Origin / manufacturer
  인도네시아: { ru: "Индонезия", en: "Indonesia" },
  한국: { ru: "Республика Корея", en: "Korea" },
  중국: { ru: "Китай", en: "China" },
  "LG전자(주)": { ru: "LG Electronics", en: "LG Electronics" },

  // Product type
  "Bespoke AI 냉장고": { ru: "Холодильник Bespoke AI", en: "Bespoke AI Refrigerator" },

  // Product names
  "LG 일반냉장고": { ru: "Холодильник LG", en: "LG Refrigerator" },
  "LG 일반냉장고 오브제컬렉션": {
    ru: "Холодильник LG Objet Collection",
    en: "LG Refrigerator Objet Collection",
  },
  "LG 디오스 AI 오브제컬렉션 냉장고 Fit & Max": {
    ru: "Холодильник LG DIOS AI Objet Collection Fit & Max",
    en: "LG DIOS AI Objet Collection Refrigerator Fit & Max",
  },
  "LG 디오스 AI 오브제컬렉션 냉장고 (더블매직스페이스)": {
    ru: "Холодильник LG DIOS AI Objet Collection (Double Magic Space)",
    en: "LG DIOS AI Objet Collection Refrigerator (Double Magic Space)",
  },
  "LG 모던엣지 냉장고 오브제컬렉션 노크온": {
    ru: "Холодильник LG MODERN EDGE Objet Collection Knock-On",
    en: "LG MODERN EDGE Refrigerator Objet Collection Knock-On",
  },
  "LG 디오스 AI 오브제컬렉션 냉장고 (양문형, 매직스페이스)": {
    ru: "Холодильник LG DIOS AI Objet Collection (Side-by-Side, Magic Space)",
    en: "LG DIOS AI Objet Collection Refrigerator (Side-by-Side, Magic Space)",
  },
  "LG 디오스 AI 오브제컬렉션 냉장고 (양문형)": {
    ru: "Холодильник LG DIOS AI Objet Collection (Side-by-Side)",
    en: "LG DIOS AI Objet Collection Refrigerator (Side-by-Side)",
  },
  "LG 디오스 AI 오브제컬렉션 냉장고": {
    ru: "Холодильник LG DIOS AI Objet Collection",
    en: "LG DIOS AI Objet Collection Refrigerator",
  },
  "LG 디오스 AI 오브제컬렉션 냉장고 (매직스페이스)": {
    ru: "Холодильник LG DIOS AI Objet Collection (Magic Space)",
    en: "LG DIOS AI Objet Collection Refrigerator (Magic Space)",
  },
  "Bespoke AI 냉장고 4도어 키친핏 Max": {
    ru: "Холодильник Bespoke AI 4 двери Kitchen Fit Max",
    en: "Bespoke AI Refrigerator 4-Door Kitchen Fit Max",
  },
  "Bespoke AI 냉장고 4도어": {
    ru: "Холодильник Bespoke AI 4 двери",
    en: "Bespoke AI Refrigerator 4-Door",
  },
  "Bespoke AI 하이브리드 4도어": { ru: "Bespoke AI Hybrid 4 двери", en: "Bespoke AI Hybrid 4-Door" },
  "Bespoke AI 하이브리드 4도어 874L (오토오픈도어)": {
    ru: "Bespoke AI Hybrid 4 двери 874 л (автооткрывание двери)",
    en: "Bespoke AI Hybrid 4-Door 874L (Auto Open Door)",
  },
  "Bespoke AI 하이브리드 4도어 키친핏 Max 609L (푸드 쇼케이스)": {
    ru: "Bespoke AI Hybrid 4 двери Kitchen Fit Max 609 л (фуд-шоукейс)",
    en: "Bespoke AI Hybrid 4-Door Kitchen Fit Max 609L (Food Showcase)",
  },
  "Bespoke AI 하이브리드 4도어 864L (AI 홈)": {
    ru: "Bespoke AI Hybrid 4 двери 864 л (AI Home)",
    en: "Bespoke AI Hybrid 4-Door 864L (AI Home)",
  },
  "Bespoke AI 패밀리허브 4도어 키친핏 Max": {
    ru: "Bespoke AI Family Hub 4 двери Kitchen Fit Max",
    en: "Bespoke AI Family Hub 4-Door Kitchen Fit Max",
  },
  "Bespoke 양문형 냉장고": { ru: "Холодильник Bespoke Side-by-Side", en: "Bespoke Side-by-Side Refrigerator" },
  "Bespoke 양문형 냉장고 845L (오토오픈도어)": {
    ru: "Холодильник Bespoke Side-by-Side 845 л (автооткрывание двери)",
    en: "Bespoke Side-by-Side Refrigerator 845L (Auto Open Door)",
  },

  // Key features (marketing bullet phrases)
  "UV청정탈취필터+": { ru: "УФ-фильтр против запахов+", en: "UV Deodorizing Filter+" },
  "도어쿨링+": { ru: "Door Cooling+", en: "Door Cooling+" },
  "24시간 자동정온": { ru: "Автоподдержание температуры 24/7", en: "24-Hour Auto Temperature Control" },
  특급냉동: { ru: "Быстрая заморозка", en: "Express Freeze" },
  신선야채실: { ru: "Отсек для свежих овощей", en: "Fresh Vegetable Compartment" },
  "강화유리 선반": { ru: "Полки из закалённого стекла", en: "Tempered Glass Shelves" },
  탈취기: { ru: "Дезодоратор", en: "Deodorizer" },
  "슬라이딩 선반": { ru: "Выдвижная полка", en: "Sliding Shelf" },
  탈취: { ru: "Устранение запахов", en: "Deodorizing" },
  "자동 정온": { ru: "Автоподдержание температуры", en: "Auto Temperature Control" },
  자동정온: { ru: "Автоподдержание температуры", en: "Auto Temperature Control" },
  "AI 신선케어": { ru: "AI-уход за свежестью", en: "AI Freshness Care" },
  ThinQ: { ru: "ThinQ", en: "ThinQ" },
  정온기능: { ru: "Функция поддержания температуры", en: "Temperature Control" },
  "오토 클로징": { ru: "Автозакрывание двери", en: "Auto Closing Door" },
  "UP 가전": { ru: "UP-техника", en: "UP Appliance" },
  "AI 절약 모드": { ru: "AI-режим энергосбережения", en: "AI Energy Saving Mode" },
  "±0.5℃ 미세정온": { ru: "Точный контроль температуры ±0,5°C", en: "±0.5°C Precise Temperature Control" },
  "SmartThings 지원": { ru: "Поддержка SmartThings", en: "SmartThings Support" },
  "푸드 쇼케이스": { ru: "Фуд-шоукейс", en: "Food Showcase" },
  "메탈쿨링 도어": { ru: "Металлическая охлаждающая дверь", en: "Metal Cooling Door" },
  "SpaceMax™": { ru: "SpaceMax™", en: "SpaceMax™" },
  "±0.5℃ 정온 냉장": { ru: "Точное охлаждение ±0,5°C", en: "±0.5°C Precise Cooling" },
  "리얼 플랫 도어": { ru: "Real Flat Door", en: "Real Flat Door" },
  솔라파워탈취기: { ru: "Дезодоратор на солнечной батарее", en: "Solar Power Deodorizer" },
  신선맞춤실: { ru: "Индивидуальный отсек свежести", en: "Custom Fresh Compartment" },
  "AI 절전모드": { ru: "AI-режим энергосбережения", en: "AI Power Saving Mode" },
  "메탈 프레쉬": { ru: "Metal Fresh", en: "Metal Fresh" },
  "메탈 프레시": { ru: "Metal Fresh", en: "Metal Fresh" },
  "접이식 선반": { ru: "Складная полка", en: "Folding Shelf" },
  스마트진단: { ru: "Смарт-диагностика", en: "Smart Diagnosis" },
  "스마트 진단": { ru: "Смарт-диагностика", en: "Smart Diagnosis" },
  노크온: { ru: "Knock-On", en: "Knock-On" },
  "좌/우 가변도어": { ru: "Перевешиваемая дверь (лево/право)", en: "Reversible Door (Left/Right)" },
  "신선 멀티실": { ru: "Мульти-отсек свежести", en: "Fresh Multi Compartment" },
  "AI 절전": { ru: "AI-энергосбережение", en: "AI Power Saving" },
  "딥러닝 냉각": { ru: "Охлаждение на основе глубокого обучения", en: "Deep Learning Cooling" },
  "신선플러스 트레이": { ru: "Лоток Fresh+", en: "Fresh+ Tray" },
  "하이브리드 정온 모드": { ru: "Гибридный режим температуры", en: "Hybrid Temperature Mode" },
  오토오픈도어: { ru: "Автооткрывание двери", en: "Auto Open Door" },
  "투명 쇼케이스": { ru: "Прозрачный шоукейс", en: "Transparent Showcase" },
  "메탈 쿨링커버": { ru: "Металлическая охлаждающая крышка", en: "Metal Cooling Cover" },
  "AI 비전 인사이드": { ru: "AI Vision Inside", en: "AI Vision Inside" },
  "AI 패밀리허브": { ru: "AI Family Hub", en: "AI Family Hub" },
  "AI 푸드매니저": { ru: "AI Food Manager", en: "AI Food Manager" },
  오토도어: { ru: "Автодверь", en: "Auto Door" },
  푸드쇼케이스: { ru: "Фуд-шоукейс", en: "Food Showcase" },
  "메탈 쿨링도어": { ru: "Металлическая охлаждающая дверь", en: "Metal Cooling Door" },
};

/** Locale-specific rendering for the "per month" (/월) unit suffix used in power consumption values. */
const PER_MONTH_SUFFIX: Record<Locale, string> = { ko: "/월", ru: "/мес", en: "/mo" };

/** Translates a raw product spec value for display. Falls back to the original
 * Korean text when no translation is known, rather than inventing one. */
export function translateSpecValue(value: string, locale: Locale): string {
  if (!value) return value;
  if (locale === "ko") return value;
  if (value === SPEC_PENDING) return PENDING_LABEL[locale];

  const dictHit = VALUE_DICTIONARY[value]?.[locale];
  if (dictHit) return dictHit;

  if (value.endsWith("/월")) {
    return value.slice(0, -"/월".length) + PER_MONTH_SUFFIX[locale];
  }

  return value;
}

export function translateKeyFeatures(features: string[], locale: Locale): string[] {
  return features.map((feature) => translateSpecValue(feature, locale));
}

const BRAND_NAMES: Record<string, Record<Locale, string>> = {
  LG: { ko: "LG전자", ru: "LG Electronics", en: "LG Electronics" },
  Samsung: { ko: "삼성전자", ru: "Samsung Electronics", en: "Samsung Electronics" },
};

/** Localized corporate brand name; the underlying "LG"/"Samsung" brand code is never altered. */
export function localizedBrandName(brand: string, locale: Locale): string {
  return BRAND_NAMES[brand]?.[locale] ?? PENDING_LABEL[locale];
}

export interface LocalizedRow {
  key: string;
  label: string;
  value: string;
  isPending: boolean;
}

/** Compact spec rows shown on the catalog card and near the product title. */
export function getLocalizedInfoRows(product: Product, locale: Locale): LocalizedRow[] {
  const t = translations[locale];
  return [
    {
      key: "brand",
      label: t.specLabels.brand,
      value: localizedBrandName(product.brand, locale),
      isPending: product.brand === SPEC_PENDING,
    },
    { key: "model", label: t.specLabels.model, value: product.model, isPending: false },
    {
      key: "productCategory",
      label: t.specLabels.productCategory,
      value: t.common.refrigeratorCategory,
      isPending: false,
    },
    {
      key: "capacity",
      label: t.specLabels.capacity,
      value: translateSpecValue(product.capacity, locale),
      isPending: product.capacity === SPEC_PENDING,
    },
    {
      key: "doorType",
      label: t.specLabels.doorType,
      value: translateSpecValue(product.doorType, locale),
      isPending: product.doorType === SPEC_PENDING,
    },
    {
      key: "color",
      label: t.specLabels.color,
      value: translateSpecValue(product.color, locale),
      isPending: product.color === SPEC_PENDING,
    },
    {
      key: "energyGrade",
      label: t.specLabels.energyGrade,
      value: translateSpecValue(product.energyGrade, locale),
      isPending: product.energyGrade === SPEC_PENDING,
    },
  ];
}

/** Highlight facts shown on the product page, built only from confirmed fields. */
export function getLocalizedHighlights(product: Product, locale: Locale): LocalizedRow[] {
  const t = translations[locale];
  const candidates: { key: keyof Product; label: string }[] = [
    { key: "capacity", label: t.specLabels.capacity },
    { key: "doorType", label: t.specLabels.doorType },
    { key: "color", label: t.specLabels.color },
    { key: "energyGrade", label: t.specLabels.energyGrade },
  ];
  return candidates
    .filter((item) => {
      const raw = product[item.key] as string;
      return Boolean(raw) && raw !== SPEC_PENDING;
    })
    .map((item) => ({
      key: item.key,
      label: item.label,
      value: translateSpecValue(product[item.key] as string, locale),
      isPending: false,
    }));
}

type SpecLabelKey = keyof TranslationDict["specLabels"];

const FULL_SPEC_FIELD_ORDER: { key: SpecLabelKey; field: keyof Product }[] = [
  { key: "brand", field: "brand" },
  { key: "model", field: "model" },
  { key: "productName", field: "productName" },
  { key: "totalCapacity", field: "totalCapacity" },
  { key: "fridgeCapacity", field: "fridgeCapacity" },
  { key: "freezerCapacity", field: "freezerCapacity" },
  { key: "dimensions", field: "dimensions" },
  { key: "dimensionsWithHandle", field: "dimensionsWithHandle" },
  { key: "dimensionsWithoutHandle", field: "dimensionsWithoutHandle" },
  { key: "depthWithoutHandle", field: "depthWithoutHandle" },
  { key: "productType", field: "productType" },
  { key: "layoutType", field: "layoutType" },
  { key: "installationType", field: "installationType" },
  { key: "doorType", field: "doorType" },
  { key: "doorDesign", field: "doorDesign" },
  { key: "doorMaterial", field: "doorMaterial" },
  { key: "handleType", field: "handleType" },
  { key: "color", field: "color" },
  { key: "material", field: "material" },
  { key: "energyGrade", field: "energyGrade" },
  { key: "monthlyPowerConsumption", field: "monthlyPowerConsumption" },
  { key: "ratedVoltage", field: "ratedVoltage" },
  { key: "compressor", field: "compressor" },
  { key: "refrigerant", field: "refrigerant" },
  { key: "coolingType", field: "coolingType" },
  { key: "noiseLevel", field: "noiseLevel" },
  { key: "autoDoorOpen", field: "autoDoorOpen" },
  { key: "weight", field: "weight" },
  { key: "dispenser", field: "dispenser" },
  { key: "foodShowcase", field: "foodShowcase" },
  { key: "transparentShowcase", field: "transparentShowcase" },
  { key: "beverageZone", field: "beverageZone" },
  { key: "magicSpace", field: "magicSpace" },
  { key: "iceMaker", field: "iceMaker" },
  { key: "iceType", field: "iceType" },
  { key: "deodorizing", field: "deodorizing" },
  { key: "display", field: "display" },
  { key: "interiorLighting", field: "interiorLighting" },
  { key: "aiVisionInside", field: "aiVisionInside" },
  { key: "wifi", field: "wifi" },
  { key: "smartThings", field: "smartThings" },
  { key: "bixby", field: "bixby" },
  { key: "smartDiagnosis", field: "smartDiagnosis" },
  { key: "upAppliance", field: "upAppliance" },
  { key: "manufacturer", field: "manufacturer" },
  { key: "countryOfOrigin", field: "countryOfOrigin" },
  { key: "releaseInfo", field: "releaseInfo" },
];

/** The full spec grid shown on the product detail page ("주요 사양"). */
export function getFullSpecRows(product: Product, locale: Locale): LocalizedRow[] {
  const t = translations[locale];
  return FULL_SPEC_FIELD_ORDER.map(({ key, field }) => {
    const raw = product[field] as string;
    const value = key === "brand" ? localizedBrandName(raw, locale) : translateSpecValue(raw, locale);
    return { key, label: t.specLabels[key], value, isPending: raw === SPEC_PENDING };
  });
}
