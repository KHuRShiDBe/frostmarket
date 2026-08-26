import { MockPaymentProvider } from "./MockPaymentProvider";
import type { PaymentProvider } from "./types";

let activeProvider: PaymentProvider | null = null;

/**
 * Single point of truth for which payment provider Checkout talks to. To add
 * a real gateway later (ClickPaymentProvider, PaymePaymentProvider, ...),
 * implement `PaymentProvider` and swap the instance created here — no
 * changes needed in Cart or the Checkout step components, since they only
 * ever call `getPaymentProvider().charge(...)`.
 */
export function getPaymentProvider(): PaymentProvider {
  if (!activeProvider) {
    activeProvider = new MockPaymentProvider();
  }
  return activeProvider;
}

export type { PaymentProvider, PaymentRequest, PaymentResult } from "./types";
