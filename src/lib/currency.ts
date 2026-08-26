/** Formats a KRW amount for display (e.g. 2490000 -> "₩2,490,000"). Currency stays KRW across all locales. */
export function formatPriceKRW(price: number): string {
  return `₩${price.toLocaleString("en-US")}`;
}
