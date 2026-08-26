"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
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

export default function CartButton({ className }: { className?: string }) {
  const { totalQuantity, openDrawer } = useCart();
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={t.cart.iconAria}
      className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${className ?? ""}`}
    >
      <CartIcon />
      {totalQuantity > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-semibold text-white">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
