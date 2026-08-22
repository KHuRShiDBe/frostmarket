import Image from "next/image";
import Link from "next/link";
import { getBrandDisplayName, getProductFullName, SPEC_PENDING, type Product } from "@/data/products";

export default function RelatedProductCard({ product }: { product: Product }) {
  const brand = getBrandDisplayName(product.brand);
  const brandPending = brand === SPEC_PENDING;

  return (
    <Link
      href={`/products/${product.id}`}
      aria-label={`${product.model} 제품 보기`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-white p-4">
        <Image
          src={product.mainImage}
          alt={`${getProductFullName(product)} 제품 이미지`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 640px) 25vw, 50vw"
        />
      </div>
      <div className="border-t border-slate-100 p-3.5">
        <p
          className={`text-xs font-semibold ${brandPending ? "italic text-slate-400" : "text-sky-600"}`}
        >
          {brand}
        </p>
        <p className="mt-0.5 text-sm font-bold text-slate-900">{product.model}</p>
      </div>
    </Link>
  );
}
