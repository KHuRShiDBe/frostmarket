import type { PaymentProvider, PaymentRequest, PaymentResult } from "./types";

/**
 * Demo-only provider: never touches real money, never collects real card
 * details. Simulates gateway latency and always approves the charge — good
 * enough to exercise the full Checkout flow before a real provider exists.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly id = "mock";
  readonly displayName = "Test Card Payment";

  async charge(request: PaymentRequest): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      success: true,
      transactionId: `MOCK-${Date.now().toString(36).toUpperCase()}-${request.orderNumber}`,
      provider: this.id,
      paidAt: new Date().toISOString(),
    };
  }
}
