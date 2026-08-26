"use client";

import { useCompare } from "@/context/CompareContext";
import { useLocale } from "@/context/LocaleContext";

function CompareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect x="3" y="5" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="9" y="8" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" fill="white" />
    </svg>
  );
}

export default function CompareToggle({
  productId,
  model,
  variant = "overlay",
}: {
  productId: string;
  model: string;
  variant?: "overlay" | "pill";
}) {
  const { isSelected, isFull, toggle } = useCompare();
  const { t } = useLocale();
  const selected = isSelected(productId);
  const disabled = !selected && isFull;

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={selected ? t.compareToggle.removeAria(model) : t.compareToggle.addAria(model)}
        title={disabled ? t.compareToggle.fullTitle : undefined}
        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto ${
          selected
            ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
            : disabled
              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
              : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-600"
        }`}
      >
        <CompareIcon />
        {selected ? t.compareToggle.pillRemove : t.compareToggle.pillAdd}
      </button>
    );
  }

  return (
    <label
      className={`absolute right-4 top-4 z-10 flex select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur transition-colors sm:right-6 sm:top-6 ${
        selected
          ? "border-sky-500 bg-sky-50 text-sky-700"
          : disabled
            ? "cursor-not-allowed border-slate-200 bg-white/70 text-slate-300"
            : "cursor-pointer border-slate-200 bg-white/90 text-slate-600 hover:border-sky-300 hover:text-sky-600"
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={() => toggle(productId)}
        aria-label={t.compareToggle.overlayAddAria(model)}
        className="h-3.5 w-3.5 accent-sky-600"
      />
      {t.compareToggle.overlayLabel}
    </label>
  );
}
