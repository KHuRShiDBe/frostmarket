"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPriceKRW } from "@/lib/currency";
import { getPaymentProvider } from "@/services/payment";
import { getOrderRepository, type CustomerInfo, type DeliveryMethodId, type Order, type OrderItem } from "@/services/orders";
import { getDeliveryCost } from "@/services/delivery";
import { getProductService } from "@/services/products";
import { localizedBrandName } from "@/i18n";

class InsufficientStockError extends Error {}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.5 14.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function PaymentStep({
  customer,
  deliveryMethod,
  onBack,
}: {
  customer: CustomerInfo;
  deliveryMethod: DeliveryMethodId;
  onBack: () => void;
}) {
  const { t, locale } = useLocale();
  const { items, totalPrice: subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const deliveryCost = getDeliveryCost(deliveryMethod);
  const total = subtotal + deliveryCost;

  const handlePay = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const productService = getProductService();

      // Stock may have changed since the item was added to the cart (another
      // order, or an admin edit) — re-check right before charging so nobody
      // can buy more than is actually in stock.
      const hasEnoughStock = items.every((line) => productService.hasSufficientStock(line.productId, line.quantity));
      if (!hasEnoughStock) {
        throw new InsufficientStockError();
      }

      const repository = getOrderRepository();
      const orderNumber = repository.nextOrderNumber();

      const result = await getPaymentProvider().charge({
        amount: total,
        currency: "KRW",
        orderNumber,
      });

      if (!result.success) {
        throw new Error(result.errorMessage ?? "Payment failed");
      }

      const orderItems: OrderItem[] = items.map((line) => {
        const product = productService.getProduct(line.productId);
        return {
          productId: line.productId,
          model: product?.model ?? line.productId,
          brand: product ? localizedBrandName(product.brand, locale) : "",
          image: product?.mainImage ?? "",
          unitPrice: product?.price ?? 0,
          quantity: line.quantity,
          lineTotal: (product?.price ?? 0) * line.quantity,
        };
      });

      const order: Order = {
        id: `ord_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        userId: user?.id,
        items: orderItems,
        customer,
        deliveryMethod,
        deliveryCost,
        subtotal,
        total,
        paymentStatus: "paid",
        orderStatus: "processing",
        paymentTransactionId: result.transactionId,
      };

      repository.save(order);
      // Only decrement once payment + order creation both succeeded.
      for (const line of items) {
        productService.decrementStock(line.productId, line.quantity);
      }
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
    } catch (error) {
      setErrorMessage(
        error instanceof InsufficientStockError
          ? t.checkout.payment.insufficientStockError
          : t.checkout.payment.errorTitle,
      );
      setIsProcessing(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-heading text-lg font-bold text-slate-900">{t.checkout.payment.heading}</h2>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
            <CardIcon />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">{t.checkout.payment.testCardTitle}</p>
            <p className="text-xs text-slate-400">{t.checkout.payment.testCardDesc}</p>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-700">
          {t.checkout.payment.disclaimer}
        </p>
      </div>

      {errorMessage && <p className="text-sm text-rose-500">{errorMessage}</p>}

      <div className="mt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.checkout.back}
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
        >
          {isProcessing && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {isProcessing ? t.checkout.payment.processing : t.checkout.payment.payButton(formatPriceKRW(total))}
        </button>
      </div>
    </div>
  );
}
