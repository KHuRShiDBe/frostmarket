"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAdminCustomers } from "@/hooks/useAdmin";
import { formatPriceKRW } from "@/lib/currency";
import { formatDate } from "@/lib/date";

export default function AdminCustomersContent() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const { rows, isLoading } = useAdminCustomers();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      ({ user }) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(q) || user.email.toLowerCase().includes(q),
    );
  }, [rows, query]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">{t.admin.customers.heading}</h1>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.admin.customers.searchPlaceholder}
          className="w-full max-w-sm rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
        />
        <span className="text-xs text-slate-400">{t.admin.customers.resultCount(filtered.length)}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {!isLoading && filtered.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-slate-400">{t.admin.customers.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.customers.columns.name}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.customers.columns.email}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.customers.columns.registeredDate}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.customers.columns.ordersCount}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.customers.columns.totalSpent}</th>
                  <th className="px-5 py-3 font-semibold sm:px-6">{t.admin.customers.columns.role}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(({ user, ordersCount, totalSpent }) => (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/admin/customers/${user.id}`)}
                    className="cursor-pointer transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
                      <Link href={`/admin/customers/${user.id}`} className="hover:underline">
                        {user.firstName} {user.lastName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 sm:px-6">{user.email}</td>
                    <td className="px-5 py-3.5 text-slate-500 sm:px-6">{formatDate(user.createdAt, locale)}</td>
                    <td className="px-5 py-3.5 text-slate-600 sm:px-6">{ordersCount}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 sm:px-6">
                      {formatPriceKRW(totalSpent)}
                    </td>
                    <td className="px-5 py-3.5 sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          user.role === "admin" ? "bg-sky-50 text-sky-600" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {t.admin.customers.roleValues[user.role]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
