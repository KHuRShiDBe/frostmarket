"use client";

import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { useLocale } from "@/context/LocaleContext";

export default function CompareNavLink({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { selectedIds } = useCompare();
  const { t } = useLocale();

  return (
    <Link
      href="/compare"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
    >
      {t.header.compareLink}
      {selectedIds.length > 0 && (
        <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-semibold text-white">
          {selectedIds.length}
        </span>
      )}
    </Link>
  );
}
