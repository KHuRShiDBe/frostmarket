"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CartToast() {
  const { notice, dismissNotice } = useCart();
  const { t } = useLocale();

  return (
    <div
      aria-live="polite"
      className={`fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4 transition-all duration-300 sm:bottom-8 ${
        notice ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      {notice && (
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckIcon />
          </span>
          <span>{notice.message}</span>
          {notice.actionLabel && notice.onAction && (
            <button
              type="button"
              onClick={() => {
                notice.onAction?.();
                dismissNotice();
              }}
              className="shrink-0 font-semibold text-sky-300 transition-colors hover:text-sky-200"
            >
              {notice.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={dismissNotice}
            aria-label={t.common.close}
            className="shrink-0 text-slate-400 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
