"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/context/LocaleContext";
import { SPEC_PENDING, type Product, type ProductStatus } from "@/data/products";
import { hasIceMaker, isFeatureSupported } from "@/lib/productSpecs";
import { getDoorTypeOptions } from "@/lib/finder";
import { translateSpecValue } from "@/i18n";
import type { ProductFormInput } from "@/services/products";

interface FormState {
  brand: string;
  model: string;
  price: string;
  totalCapacity: string;
  doorType: string;
  color: string;
  energyGrade: "1" | "2" | "3";
  wifi: boolean;
  iceMaker: boolean;
  dispenser: boolean;
  mainImage: string;
  additionalImages: string;
  stock: string;
  status: ProductStatus;
}

type FormErrors = Partial<Record<"brand" | "model" | "price" | "totalCapacity" | "stock" | "mainImage", string>>;

function emptyForm(): FormState {
  return {
    brand: "LG",
    model: "",
    price: "",
    totalCapacity: "",
    doorType: "",
    color: "",
    energyGrade: "1",
    wifi: false,
    iceMaker: false,
    dispenser: false,
    mainImage: "",
    additionalImages: "",
    stock: "0",
    status: "active",
  };
}

function productToForm(product: Product): FormState {
  const gradeMatch = product.energyGrade.match(/([123])/);
  return {
    brand: product.brand === SPEC_PENDING ? "" : product.brand,
    model: product.model,
    price: String(product.price),
    totalCapacity: String(parseFloat(product.totalCapacity) || ""),
    doorType: product.doorType === SPEC_PENDING ? "" : product.doorType,
    color: product.color === SPEC_PENDING ? "" : product.color,
    energyGrade: (gradeMatch ? gradeMatch[1] : "1") as "1" | "2" | "3",
    wifi: isFeatureSupported(product.wifi),
    iceMaker: hasIceMaker(product.iceMaker),
    dispenser: isFeatureSupported(product.dispenser) || product.dispenser === "있음",
    mainImage: product.mainImage,
    additionalImages: product.images.filter((img) => img !== product.mainImage).join("\n"),
    stock: String(product.stock),
    status: product.status,
  };
}

function toPatch(form: FormState): Partial<Product> & ProductFormInput {
  const additionalImages = form.additionalImages
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    brand: form.brand.trim(),
    model: form.model.trim(),
    price: Number(form.price),
    totalCapacity: `${Number(form.totalCapacity)} L`,
    doorType: form.doorType || SPEC_PENDING,
    color: form.color.trim() || SPEC_PENDING,
    energyGrade: `${form.energyGrade}등급`,
    wifi: form.wifi ? "지원" : SPEC_PENDING,
    iceMaker: form.iceMaker ? "있음" : SPEC_PENDING,
    dispenser: form.dispenser ? "있음" : SPEC_PENDING,
    mainImage: form.mainImage.trim(),
    images: [form.mainImage.trim(), ...additionalImages],
    stock: Math.max(0, Math.round(Number(form.stock))),
    status: form.status,
  };
}

const fieldClass =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

export default function ProductForm({
  mode,
  initialProduct,
  products,
  onSubmit,
}: {
  mode: "create" | "edit";
  initialProduct?: Product;
  products: Product[];
  onSubmit: (patch: Partial<Product> & ProductFormInput) => void;
}) {
  const { t, locale } = useLocale();
  const [form, setForm] = useState<FormState>(initialProduct ? productToForm(initialProduct) : emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});

  const doorTypeOptions = getDoorTypeOptions(products);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputClass = (field: keyof FormErrors) =>
    `${fieldClass} ${errors[field] ? "border-rose-300" : "border-slate-200"}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    const required = t.admin.productForm.validation.required;

    if (!form.brand.trim()) nextErrors.brand = required;
    if (!form.model.trim()) nextErrors.model = required;
    if (!form.price || Number(form.price) <= 0) nextErrors.price = t.admin.productForm.validation.invalidPrice;
    if (!form.totalCapacity || Number(form.totalCapacity) <= 0) {
      nextErrors.totalCapacity = t.admin.productForm.validation.invalidCapacity;
    }
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isFinite(Number(form.stock))) {
      nextErrors.stock = t.admin.productForm.validation.invalidStock;
    }
    if (!form.mainImage.trim()) nextErrors.mainImage = t.admin.productForm.validation.imageRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit(toPatch(form));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.productForm.sections.basicInfo}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-brand" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.brand} *
            </label>
            <input
              id="product-brand"
              type="text"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              aria-invalid={!!errors.brand}
              className={inputClass("brand")}
            />
            {errors.brand && <p className="text-xs text-rose-500">{errors.brand}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-model" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.model} *
            </label>
            <input
              id="product-model"
              type="text"
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder={t.admin.productForm.placeholders.model}
              aria-invalid={!!errors.model}
              className={inputClass("model")}
            />
            {errors.model && <p className="text-xs text-rose-500">{errors.model}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-price" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.price} *
            </label>
            <input
              id="product-price"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              aria-invalid={!!errors.price}
              className={inputClass("price")}
            />
            {errors.price && <p className="text-xs text-rose-500">{errors.price}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-color" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.color}
            </label>
            <input
              id="product-color"
              type="text"
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
              placeholder={t.admin.productForm.placeholders.color}
              className={`${fieldClass} border-slate-200`}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.productForm.sections.specs}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-capacity" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.totalCapacity} *
            </label>
            <input
              id="product-capacity"
              type="number"
              min={0}
              value={form.totalCapacity}
              onChange={(e) => update("totalCapacity", e.target.value)}
              aria-invalid={!!errors.totalCapacity}
              className={inputClass("totalCapacity")}
            />
            {errors.totalCapacity && <p className="text-xs text-rose-500">{errors.totalCapacity}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-doorType" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.doorType}
            </label>
            <select
              id="product-doorType"
              value={form.doorType}
              onChange={(e) => update("doorType", e.target.value)}
              className={`${fieldClass} border-slate-200`}
            >
              <option value="">{SPEC_PENDING}</option>
              {doorTypeOptions.map((doorType) => (
                <option key={doorType} value={doorType}>
                  {translateSpecValue(doorType, locale)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-energyGrade" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.energyGrade}
            </label>
            <select
              id="product-energyGrade"
              value={form.energyGrade}
              onChange={(e) => update("energyGrade", e.target.value as "1" | "2" | "3")}
              className={`${fieldClass} border-slate-200`}
            >
              <option value="1">{t.catalog.energyGradeOption(1)}</option>
              <option value="2">{t.catalog.energyGradeOption(2)}</option>
              <option value="3">{t.catalog.energyGradeOption(3)}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.wifi}
              onChange={(e) => update("wifi", e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            {t.admin.productForm.fields.wifi}
          </label>
          <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.iceMaker}
              onChange={(e) => update("iceMaker", e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            {t.admin.productForm.fields.iceMaker}
          </label>
          <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.dispenser}
              onChange={(e) => update("dispenser", e.target.checked)}
              className="h-4 w-4 accent-sky-600"
            />
            {t.admin.productForm.fields.dispenser}
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.productForm.sections.images}</h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-mainImage" className="text-sm font-medium text-slate-700">
            {t.admin.productForm.fields.mainImage} *
          </label>
          <input
            id="product-mainImage"
            type="text"
            value={form.mainImage}
            onChange={(e) => update("mainImage", e.target.value)}
            placeholder={t.admin.productForm.placeholders.mainImage}
            aria-invalid={!!errors.mainImage}
            className={inputClass("mainImage")}
          />
          {errors.mainImage && <p className="text-xs text-rose-500">{errors.mainImage}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-additionalImages" className="text-sm font-medium text-slate-700">
            {t.admin.productForm.fields.additionalImages}
          </label>
          <textarea
            id="product-additionalImages"
            value={form.additionalImages}
            onChange={(e) => update("additionalImages", e.target.value)}
            placeholder={t.admin.productForm.placeholders.additionalImages}
            rows={3}
            className={`${fieldClass} border-slate-200`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-heading text-base font-bold text-slate-900">{t.admin.productForm.sections.inventory}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="product-stock" className="text-sm font-medium text-slate-700">
              {t.admin.productForm.fields.stock} *
            </label>
            <input
              id="product-stock"
              type="number"
              min={0}
              step={1}
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              aria-invalid={!!errors.stock}
              className={inputClass("stock")}
            />
            {errors.stock && <p className="text-xs text-rose-500">{errors.stock}</p>}
          </div>
          {mode === "edit" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="product-status" className="text-sm font-medium text-slate-700">
                {t.admin.productForm.fields.status}
              </label>
              <select
                id="product-status"
                value={form.status}
                onChange={(e) => update("status", e.target.value as ProductStatus)}
                className={`${fieldClass} border-slate-200`}
              >
                <option value="active">{t.admin.status.active}</option>
                <option value="draft">{t.admin.status.draft}</option>
                <option value="outOfStock">{t.admin.status.outOfStock}</option>
              </select>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-sky-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
        >
          {mode === "create" ? t.admin.productForm.submitCreate : t.admin.productForm.submitEdit}
        </button>
      </div>
    </form>
  );
}
