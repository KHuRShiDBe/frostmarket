export interface PaymentRequest {
  /** Amount in the smallest "whole unit" of the currency — KRW has no minor unit, so this is just won. */
  amount: number;
  currency: "KRW";
  /** Pre-allocated order number the payment should be associated with (for reconciliation with a real gateway). */
  orderNumber: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  provider: string;
  paidAt: string;
  /** Present only when success is false. */
  errorMessage?: string;
}

/**
 * Seam between Checkout UI and whatever actually moves money. Swap the
 * instance returned by `getPaymentProvider()` (see ./index.ts) to plug in a
 * real gateway (Click, Payme, card acquiring, ...) later — Cart and Checkout
 * components only ever depend on this interface, never on a concrete provider.
 */
export interface PaymentProvider {
  readonly id: string;
  readonly displayName: string;
  charge(request: PaymentRequest): Promise<PaymentResult>;
}
