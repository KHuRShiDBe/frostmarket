"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M3 4h2l1.6 9.6a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L19.5 8H6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="19.5" r="1.4" fill="currentColor" />
      <circle cx="16.5" cy="19.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function AddToCartButton({
  productId,
  model,
  variant = "pill",
  className,
}: {
  productId: string;
  model?: string;
  variant?: "pill" | "overlay";
  className?: string;
}) {
  const { addItem } = useCart();
  const { t } = useLocale();

  if (variant === "overlay") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addItem(productId);
        }}
        aria-label={model ? `${t.cart.addToCart}: ${model}` : t.cart.addToCart}
        className="absolute right-4 top-24 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:border-sky-300 hover:text-sky-600 sm:right-6 sm:top-28"
      >
        <CartIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      className={
        className ??
        "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto"
      }
    >
      <CartIcon />
      {t.cart.addToCart}
    </button>
  );
}
