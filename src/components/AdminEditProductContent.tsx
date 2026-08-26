"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useAdminProduct, useAdminProducts } from "@/hooks/useAdmin";
import type { Product } from "@/data/products";
import type { ProductFormInput } from "@/services/products";
import ProductForm from "./ProductForm";

export default function AdminEditProductContent({ productId }: { productId: string }) {
  const { t } = useLocale();
  const { product, isLoading, updateProduct } = useAdminProduct(productId);
  const { products } = useAdminProducts();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleSubmit = (patch: Partial<Product> & ProductFormInput) => {
    updateProduct(patch);
    setSuccessMessage(t.admin.productForm.successUpdate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return null;

  if (!product) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-sky-600">
          {t.admin.productForm.backToProducts}
        </Link>
        <p className="text-sm text-slate-500">{t.admin.products.empty}</p>
      </div>
    );
  }

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
          {t.admin.productForm.editTitle} — {product.model}
        </h1>
      </div>

      {successMessage && (
        <p className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700">{successMessage}</p>
      )}

      <ProductForm mode="edit" initialProduct={product} products={products} onSubmit={handleSubmit} />
    </div>
  );
}
