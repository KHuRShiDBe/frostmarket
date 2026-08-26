"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "./PasswordInput";
import type { TranslationDict } from "@/i18n";

const MIN_PASSWORD_LENGTH = 8;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function validate(form: FormState, t: TranslationDict): Errors {
  const errors: Errors = {};
  const required = t.checkout.validation.required;

  if (!form.firstName.trim()) errors.firstName = required;
  if (!form.lastName.trim()) errors.lastName = required;

  if (!form.email.trim()) {
    errors.email = required;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = t.checkout.validation.invalidEmail;
  }

  if (!form.password) {
    errors.password = required;
  } else if (form.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = t.auth.validation.passwordTooShort(MIN_PASSWORD_LENGTH);
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = required;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = t.auth.validation.passwordMismatch;
  }

  return errors;
}

const fieldInputClass =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

export default function RegisterForm() {
  const { t } = useLocale();
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const inputClass = (field: keyof FormState) =>
    `${fieldInputClass} ${errors[field] ? "border-rose-300" : "border-slate-200"}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form, t);
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setFormError(t.auth.errors[result.error]);
      return;
    }

    const redirect = new URLSearchParams(window.location.search).get("redirect");
    router.push(redirect || "/account");
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h1 className="font-heading text-xl font-bold text-slate-900">{t.auth.register.title}</h1>

      {formError && (
        <p className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600">{formError}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.firstName} *</label>
          <input
            type="text"
            value={form.firstName}
            onChange={update("firstName")}
            placeholder={t.auth.fields.firstNamePlaceholder}
            className={inputClass("firstName")}
          />
          {errors.firstName && <p className="text-xs text-rose-500">{errors.firstName}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.lastName} *</label>
          <input
            type="text"
            value={form.lastName}
            onChange={update("lastName")}
            placeholder={t.auth.fields.lastNamePlaceholder}
            className={inputClass("lastName")}
          />
          {errors.lastName && <p className="text-xs text-rose-500">{errors.lastName}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.email} *</label>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder={t.auth.fields.emailPlaceholder}
            className={inputClass("email")}
          />
          {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.phoneOptional}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder={t.auth.fields.phonePlaceholder}
            className={inputClass("phone")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.password} *</label>
          <PasswordInput
            value={form.password}
            onChange={update("password")}
            placeholder={t.auth.fields.passwordPlaceholder}
            autoComplete="new-password"
            className={inputClass("password")}
          />
          {errors.password ? (
            <p className="text-xs text-rose-500">{errors.password}</p>
          ) : (
            <p className="text-xs text-slate-400">{t.auth.password.minLengthHint(MIN_PASSWORD_LENGTH)}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.confirmPassword} *</label>
          <PasswordInput
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            placeholder={t.auth.fields.confirmPasswordPlaceholder}
            autoComplete="new-password"
            className={inputClass("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-xs text-rose-500">{errors.confirmPassword}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
      >
        {t.auth.register.submit}
      </button>

      <p className="text-center text-sm text-slate-500">
        {t.auth.register.haveAccount}{" "}
        <Link href="/login" className="font-semibold text-sky-600 hover:text-sky-700">
          {t.auth.register.signInLink}
        </Link>
      </p>
    </form>
  );
}
