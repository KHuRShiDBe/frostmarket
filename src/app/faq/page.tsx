import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { buildOpenGraph } from "@/lib/seo";

const title = "자주 묻는 질문 | FrostMarket";
const description = "FrostMarket 자주 묻는 질문 안내.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: buildOpenGraph({ title, description }),
};

export default function FaqPage() {
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
            고객 지원
          </span>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            자주 묻는 질문
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
            FrostMarket 이용과 관련해 자주 문의해 주시는 내용을 정리했습니다.
          </p>
        </div>

        <FaqAccordion />
      </div>
    </main>
  );
}
