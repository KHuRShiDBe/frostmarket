"use client";

import { useLocale } from "@/context/LocaleContext";
import { SEED_ADMIN_EMAIL, SEED_ADMIN_DEMO_PASSWORD } from "@/services/auth";

/**
 * Portfolio-demo discoverability, not a real secret: this app has no real
 * backend, so there's nothing this account actually protects. The password
 * is never stored anywhere as plaintext — only its hash is (see
 * services/auth/seedAdmin.ts) — this is just a visible hint so /admin is
 * reachable without reading source code.
 */
export default function DemoAdminHint() {
  const { t } = useLocale();

  return (
    <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
      <p className="font-semibold uppercase tracking-wide text-slate-400">{t.auth.demoAdminLabel}</p>
      <p className="mt-1 font-mono text-slate-600">
        {SEED_ADMIN_EMAIL} / {SEED_ADMIN_DEMO_PASSWORD}
      </p>
    </div>
  );
}
