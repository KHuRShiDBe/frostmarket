"use client";

import { useCompare } from "@/context/CompareContext";

export default function CompareToggle({
  productId,
  model,
}: {
  productId: string;
  model: string;
}) {
  const { isSelected, isFull, toggle } = useCompare();
  const selected = isSelected(productId);
  const disabled = !selected && isFull;

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
        aria-label={`${model} 비교하기에 추가`}
        className="h-3.5 w-3.5 accent-sky-600"
      />
      비교하기
    </label>
  );
}
