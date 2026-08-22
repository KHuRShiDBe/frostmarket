import Image from "next/image";
import Link from "next/link";
import {
  getBrandDisplayName,
  getProductFullName,
  getProductInfoRows,
  SPEC_PENDING,
  type Product,
} from "@/data/products";
import CompareToggle from "./CompareToggle";
import FavoriteToggle from "./FavoriteToggle";
import QuickViewButton from "./QuickViewButton";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M7 17 17 7M17 7H9M17 7v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const reversed = index % 2 === 1;
  const brandDisplay = getBrandDisplayName(product.brand);
  const infoRows = getProductInfoRows(product);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-[0_28px_56px_-24px_rgba(15,23,42,0.2)]">
      <CompareToggle productId={product.id} model={product.model} />
      <FavoriteToggle productId={product.id} model={product.model} />
      <QuickViewButton productId={product.id} model={product.model} />

      <Link
        href={`/products/${product.id}`}
        aria-label={`${product.model} 제품 보기`}
        className={`flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:flex-row ${
          reversed ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="relative h-[60vh] w-full shrink-0 overflow-hidden bg-white p-6 sm:h-[70vh] sm:p-10 lg:h-[78vh] lg:w-1/2">
          <Image
            src={product.mainImage}
            alt={`${getProductFullName(product)} 제품 이미지`}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={index === 0}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 p-8 sm:gap-5 sm:p-12 lg:p-16">
          <div>
            <span
              className={`text-sm font-bold uppercase tracking-wide sm:text-base ${
                brandDisplay === SPEC_PENDING ? "italic text-slate-400" : "text-sky-600"
              }`}
            >
              {brandDisplay}
            </span>
            <h3 className="mt-1 font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {product.model}
            </h3>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-slate-100 pt-4 text-sm sm:gap-y-3 sm:pt-5">
            {infoRows.map((row) => {
              const isPending = row.value === SPEC_PENDING;
              return (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <dt className="text-xs text-slate-400">{row.label}</dt>
                  <dd className={isPending ? "italic text-slate-400" : "font-medium text-slate-900"}>
                    {row.value}
                  </dd>
                </div>
              );
            })}
          </dl>

          <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-sky-600">
            자세히 보기
            <ArrowIcon />
          </span>
        </div>
      </Link>
    </div>
  );
}
