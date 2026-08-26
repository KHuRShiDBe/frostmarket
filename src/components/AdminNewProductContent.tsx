"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAdminProducts } from "@/hooks/useAdmin";
import type { Product } from "@/data/products";
import type { ProductFormInput } from "@/services/products";
import ProductForm from "./ProductForm";

export default function AdminNewProductContent() {
  const { t } = useLocale();
  const router = useRouter();
  const { products, createProduct } = useAdminProducts();

  const handleSubmit = (patch: Partial<Product> & ProductFormInput) => {
    createProduct(patch);
    router.push("/admin/products");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/products"
          className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          {t.admin.productForm.backToProducts}
        </Link>
        <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
          {t.admin.productForm.addTitle}
        </h1>
      </div>

      <ProductForm mode="create" products={products} onSubmit={handleSubmit} />
    </div>
  );
}
