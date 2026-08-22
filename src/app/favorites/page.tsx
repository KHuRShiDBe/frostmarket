import type { Metadata } from "next";
import Link from "next/link";
import FavoritesView from "@/components/FavoritesView";
import { buildOpenGraph } from "@/lib/seo";

const title = "관심 제품 | FrostMarket";
const description = "FrostMarket에서 저장한 관심 냉장고 목록.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/favorites" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function FavoritesPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1560px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          ← 홈으로
        </Link>

        <div className="mb-8 flex flex-col gap-1.5 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            관심 제품
          </span>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            저장한 냉장고
          </h1>
        </div>

        <FavoritesView />
      </div>
    </main>
  );
}
