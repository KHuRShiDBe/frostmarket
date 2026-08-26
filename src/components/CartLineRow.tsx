"use client";

import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/data/products";
import { localizedBrandName } from "@/i18n";
import { useLocale } from "@/context/LocaleContext";
import { useCart, MIN_QUANTITY, MAX_QUANTITY } from "@/context/CartContext";
import { formatPriceKRW } from "@/lib/currency";

export default function CartLineRow({
  productId,
  quantity,
  compact = false,
  onNavigate,
}: {
  productId: string;
  quantity: number;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { locale, t } = useLocale();
  const { setQuantity, removeItem } = useCart();
  const product = getProduct(productId);
  if (!product) return null;

  const brand = localizedBrandName(product.brand, locale);
  const imageSize = compact ? "h-16 w-16" : "h-24 w-24 sm:h-28 sm:w-28";

  return (
    <div className="flex gap-3 sm:gap-4">
      <Link
        href={`/products/${product.id}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white ${imageSize}`}
      >
        <Image src={product.mainImage} alt={product.model} fill className="object-contain p-1.5" sizes="112px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`} onClick={onNavigate} className="min-w-0">
            <p className="text-xs font-semibold text-sky-600">{brand}</p>
            <p className="truncate text-sm font-bold text-slate-900">{product.model}</p>
            {!compact && (
              <p className="mt-0.5 text-xs text-slate-400">
                {t.cart.unitPrice}: {formatPriceKRW(product.price)}
              </p>
            )}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={t.cart.remove}
            className="shrink-0 text-xs text-slate-400 transition-colors hover:text-rose-500 hover:underline"
          >
            {t.cart.remove}
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-1 py-1">
            <button
              type="button"
              onClick={() => setQuantity(product.id, quantity - 1)}
              disabled={quantity <= MIN_QUANTITY}
              aria-label={`${t.cart.quantity} -1`}
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-medium text-slate-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(product.id, quantity + 1)}
              disabled={quantity >= MAX_QUANTITY}
              aria-label={`${t.cart.quantity} +1`}
              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
            >
              +
            </button>
          </div>
          <p className="text-sm font-bold text-slate-900">{formatPriceKRW(product.price * quantity)}</p>
        </div>
      </div>
    </div>
  );
}
