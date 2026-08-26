"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import CheckoutStepper, { type CheckoutStep } from "./CheckoutStepper";
import CustomerInfoForm from "./CustomerInfoForm";
import DeliveryStep from "./DeliveryStep";
import PaymentStep from "./PaymentStep";
import OrderSummaryPanel from "./OrderSummaryPanel";
import { DEFAULT_DELIVERY_METHOD, getDeliveryCost } from "@/services/delivery";
import type { CustomerInfo, DeliveryMethodId } from "@/services/orders";

const EMPTY_CUSTOMER: CustomerInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  apartment: "",
  postalCode: "",
};

export default function CheckoutPageContent() {
  const { items } = useCart();
  const { t } = useLocale();
  const [step, setStep] = useState<CheckoutStep>("information");
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>(DEFAULT_DELIVERY_METHOD);

  if (items.length === 0) {
    return (
      <div>
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          {t.common.backHome}
        </Link>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
          <p className="text-sm font-medium text-slate-600">{t.checkout.emptyCart.title}</p>
          <Link
            href="/#catalog"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            {t.checkout.emptyCart.cta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          ← {t.cart.viewCart}
        </Link>
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.checkout.pageTitle}</h1>
      </div>

      <CheckoutStepper current={step} />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-12">
        <div className="order-2 lg:order-1">
          {step === "information" && (
            <CustomerInfoForm
              initialValue={customer}
              onContinue={(info) => {
                setCustomer(info);
                setStep("delivery");
              }}
            />
          )}
          {step === "delivery" && (
            <DeliveryStep
              value={deliveryMethod}
              onChange={setDeliveryMethod}
              onContinue={() => setStep("payment")}
              onBack={() => setStep("information")}
            />
          )}
          {step === "payment" && (
            <PaymentStep customer={customer} deliveryMethod={deliveryMethod} onBack={() => setStep("delivery")} />
          )}
        </div>

        <div className="order-1 lg:order-2">
          <OrderSummaryPanel deliveryCost={getDeliveryCost(deliveryMethod)} />
        </div>
      </div>
    </div>
  );
}
