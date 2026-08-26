"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";

const fieldInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

export default function AccountProfileContent() {
  const { user, updateProfile } = useAuth();
  const { t } = useLocale();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    const result = await updateProfile({ firstName, lastName, phone });
    setIsSaving(false);
    if (result.success) setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.account.profile.title}</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:max-w-lg sm:p-8"
      >
        {saved && (
          <p className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-600">
            {t.account.profile.saved}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.email}</label>
          <input type="email" value={user.email} disabled className={`${fieldInputClass} cursor-not-allowed bg-slate-50 text-slate-400`} />
          <p className="text-xs text-slate-400">{t.account.profile.emailNote}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t.auth.fields.firstName}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              className={fieldInputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">{t.auth.fields.lastName}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              className={fieldInputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">{t.auth.fields.phoneOptional}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            placeholder={t.auth.fields.phonePlaceholder}
            className={fieldInputClass}
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex w-fit items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
        >
          {t.account.profile.save}
        </button>
      </form>
    </div>
  );
}
