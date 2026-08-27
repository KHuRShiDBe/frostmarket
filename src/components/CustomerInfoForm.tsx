"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/context/LocaleContext";
import type { CustomerInfo } from "@/services/orders";
import type { TranslationDict } from "@/i18n";

type Errors = Partial<Record<keyof CustomerInfo, string>>;

function validate(info: CustomerInfo, t: TranslationDict): Errors {
  const errors: Errors = {};
  const required = t.checkout.validation.required;

  if (!info.firstName.trim()) errors.firstName = required;
  if (!info.lastName.trim()) errors.lastName = required;

  if (!info.phone.trim()) {
    errors.phone = required;
  } else if (!/^[0-9+\-\s()]{7,20}$/.test(info.phone.trim())) {
    errors.phone = t.checkout.validation.invalidPhone;
  }

  if (!info.email.trim()) {
    errors.email = required;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) {
    errors.email = t.checkout.validation.invalidEmail;
  }

  if (!info.city.trim()) errors.city = required;
  if (!info.address.trim()) errors.address = required;

  return errors;
}

const fieldInputClass =
  "rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

function Field({
  id,
  label,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CustomerInfoForm({
  initialValue,
  onContinue,
}: {
  initialValue: CustomerInfo;
  onContinue: (info: CustomerInfo) => void;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState<CustomerInfo>(initialValue);
  const [errors, setErrors] = useState<Errors>({});

  const update = (field: keyof CustomerInfo) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const inputClass = (field: keyof CustomerInfo) =>
    `${fieldInputClass} ${errors[field] ? "border-rose-300" : "border-slate-200"}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onContinue(form);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="font-heading text-lg font-bold text-slate-900">{t.checkout.info.heading}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="checkout-firstName" label={t.checkout.info.firstName} required error={errors.firstName}>
          <input
            id="checkout-firstName"
            type="text"
            value={form.firstName}
            onChange={update("firstName")}
            placeholder={t.checkout.info.firstNamePlaceholder}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "checkout-firstName-error" : undefined}
            className={inputClass("firstName")}
          />
        </Field>
        <Field id="checkout-lastName" label={t.checkout.info.lastName} required error={errors.lastName}>
          <input
            id="checkout-lastName"
            type="text"
            value={form.lastName}
            onChange={update("lastName")}
            placeholder={t.checkout.info.lastNamePlaceholder}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "checkout-lastName-error" : undefined}
            className={inputClass("lastName")}
          />
        </Field>
        <Field id="checkout-phone" label={t.checkout.info.phone} required error={errors.phone}>
          <input
            id="checkout-phone"
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder={t.checkout.info.phonePlaceholder}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
            className={inputClass("phone")}
          />
        </Field>
        <Field id="checkout-email" label={t.checkout.info.email} required error={errors.email}>
          <input
            id="checkout-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder={t.checkout.info.emailPlaceholder}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "checkout-email-error" : undefined}
            className={inputClass("email")}
          />
        </Field>
        <Field id="checkout-city" label={t.checkout.info.city} required error={errors.city}>
          <input
            id="checkout-city"
            type="text"
            value={form.city}
            onChange={update("city")}
            placeholder={t.checkout.info.cityPlaceholder}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "checkout-city-error" : undefined}
            className={inputClass("city")}
          />
        </Field>
        <Field id="checkout-postalCode" label={t.checkout.info.postalCode}>
          <input
            id="checkout-postalCode"
            type="text"
            value={form.postalCode}
            onChange={update("postalCode")}
            placeholder={t.checkout.info.postalCodePlaceholder}
            className={inputClass("postalCode")}
          />
        </Field>
        <Field
          id="checkout-address"
          label={t.checkout.info.address}
          required
          error={errors.address}
          className="sm:col-span-2"
        >
          <input
            id="checkout-address"
            type="text"
            value={form.address}
            onChange={update("address")}
            placeholder={t.checkout.info.addressPlaceholder}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? "checkout-address-error" : undefined}
            className={inputClass("address")}
          />
        </Field>
        <Field id="checkout-apartment" label={t.checkout.info.apartment} className="sm:col-span-2">
          <input
            id="checkout-apartment"
            type="text"
            value={form.apartment}
            onChange={update("apartment")}
            placeholder={t.checkout.info.apartmentPlaceholder}
            className={inputClass("apartment")}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        {t.checkout.continue}
      </button>
    </form>
  );
}
