"use client";

import { useLocale } from "@/context/LocaleContext";

export default function AdminSettingsContent() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.admin.settings.heading}</h1>
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <p className="text-sm text-slate-500">{t.admin.settings.body}</p>
      </div>
    </div>
  );
}
