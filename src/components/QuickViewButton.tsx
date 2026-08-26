"use client";

import { useQuickView } from "@/context/QuickViewContext";
import { useLocale } from "@/context/LocaleContext";

export default function QuickViewButton({
  productId,
  model,
}: {
  productId: string;
  model: string;
}) {
  const { openQuickView } = useQuickView();
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(productId);
      }}
      aria-label={t.quickView.buttonAria(model)}
      className="absolute right-4 top-14 z-10 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur transition-colors hover:border-sky-300 hover:text-sky-600 sm:right-6 sm:top-16"
    >
      {t.quickView.buttonLabel}
    </button>
  );
}
