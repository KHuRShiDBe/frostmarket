"use client";

import { useLocale } from "@/context/LocaleContext";
import { DELIVERY_METHODS } from "@/services/delivery";
import type { DeliveryMethodId } from "@/services/orders";
import { formatPriceKRW } from "@/lib/currency";

export default function DeliveryStep({
  value,
  onChange,
  onContinue,
  onBack,
}: {
  value: DeliveryMethodId;
  onChange: (id: DeliveryMethodId) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { t } = useLocale();
  const selected = value;

  const labels: Record<DeliveryMethodId, { name: string; desc: string }> = {
    standard: { name: t.checkout.delivery.standardName, desc: t.checkout.delivery.standardDesc },
    express: { name: t.checkout.delivery.expressName, desc: t.checkout.delivery.expressDesc },
    pickup: { name: t.checkout.delivery.pickupName, desc: t.checkout.delivery.pickupDesc },
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-heading text-lg font-bold text-slate-900">{t.checkout.delivery.heading}</h2>

      <div className="flex flex-col gap-3">
        {DELIVERY_METHODS.map((method) => {
          const active = selected === method.id;
          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                active ? "border-sky-500 bg-sky-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery-method"
                  checked={active}
                  onChange={() => onChange(method.id)}
                  className="h-4 w-4 accent-sky-600"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{labels[method.id].name}</span>
                  <span className="block text-xs text-slate-400">{labels[method.id].desc}</span>
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-slate-900">
                {method.cost === 0 ? t.cart.free : formatPriceKRW(method.cost)}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
        >
          {t.checkout.back}
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {t.checkout.continue}
        </button>
      </div>
    </div>
  );
}
