"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "./PasswordInput";

const fieldInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

export default function LoginForm() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError(t.checkout.validation.required);
      return;
    }

    setIsSubmitting(true);
    const result = await login({ email, password }, rememberMe);
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
      <h1 className="font-heading text-xl font-bold text-slate-900">{t.auth.login.title}</h1>

      {formError && (
        <p className="rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600">{formError}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">{t.auth.fields.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder={t.auth.fields.emailPlaceholder}
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.password}</label>
          <Link href="/forgot-password" className="text-xs font-medium text-sky-600 hover:text-sky-700">
            {t.auth.login.forgotPasswordLink}
          </Link>
        </div>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.auth.fields.passwordPlaceholder}
          autoComplete="current-password"
          className={fieldInputClass}
        />
      </div>

      <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 accent-sky-600"
        />
        {t.auth.login.rememberMe}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
      >
        {t.auth.login.submit}
      </button>

      <p className="text-center text-sm text-slate-500">
        {t.auth.login.noAccount}{" "}
        <Link href="/register" className="font-semibold text-sky-600 hover:text-sky-700">
          {t.auth.login.registerLink}
        </Link>
      </p>
    </form>
  );
}
