import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import { buildOpenGraph } from "@/lib/seo";

const title = "문의하기 | FrostMarket";
const description = "FrostMarket 제품 문의 양식.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/inquiry" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function InquiryPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          ← 홈으로
        </Link>

        <div className="mb-8 flex flex-col gap-1.5 sm:mb-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            고객 지원
          </span>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            문의하기
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
            아래 양식에 문의 내용을 작성해 주세요. 현재 온라인 문의 접수 기능은 준비
            중이며, 제출 시 안내 메시지가 표시됩니다.
          </p>
        </div>

        <InquiryForm />
      </div>
    </main>
  );
}
