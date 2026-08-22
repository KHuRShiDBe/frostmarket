import type { Metadata } from "next";
import Link from "next/link";
import { buildOpenGraph } from "@/lib/seo";

const title = "FrostMarket 소개 | FrostMarket";
const description = "FrostMarket가 어떤 서비스인지 소개합니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: buildOpenGraph({ title, description }),
};

const FEATURES = [
  {
    title: "다양한 냉장고 모델 확인",
    desc: "여러 브랜드의 냉장고를 한 곳에서 확인할 수 있습니다.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 6.5h.01M8 14h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "브랜드별 제품 탐색",
    desc: "브랜드 필터로 원하는 제조사의 제품만 모아볼 수 있습니다.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M11 3.5H5.5A2 2 0 0 0 3.5 5.5V11c0 .5.2 1 .6 1.4l8 8c.8.8 2 .8 2.8 0l5.5-5.5c.8-.8.8-2 0-2.8l-8-8c-.4-.4-.9-.6-1.4-.6Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="8.3" cy="8.3" r="1.3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "제품 비교",
    desc: "최대 3개까지 제품을 선택해 사양을 나란히 비교할 수 있습니다.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="3" y="4" width="7.5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="4" width="7.5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.75 9.5v5M17.25 9.5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "관심 제품 저장",
    desc: "마음에 드는 냉장고를 관심 제품으로 저장해 나중에 다시 확인할 수 있습니다.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M12 20.5s-7-4.4-9.5-8.8C.9 8.7 2.3 4.5 6.3 4.5c2.2 0 3.7 1.3 5.7 3.5 2-2.2 3.5-3.5 5.7-3.5 4 0 5.4 4.2 3.8 7.2C19 16.1 12 20.5 12 20.5z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1560px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          ← 홈으로
        </Link>

        <div className="mb-10 flex flex-col gap-1.5 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            FrostMarket
          </span>
          <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            FrostMarket 소개
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            FrostMarket는 여러 브랜드의 냉장고를 한곳에서 살펴보고, 비교하고, 마음에 드는
            제품을 찾아볼 수 있도록 돕는 냉장고 카탈로그 서비스입니다.
          </p>
        </div>

        <section className="mb-12 sm:mb-16">
          <h2 className="mb-5 text-lg font-bold text-slate-900 sm:mb-6 sm:text-xl">
            우리가 제공하는 것
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  {feature.icon}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 max-w-2xl sm:mb-16">
          <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">
            FrostMarket의 목표
          </h2>
          <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
            냉장고는 종류와 옵션이 많아 비교하기가 쉽지 않습니다. FrostMarket의 목표는
            이렇게 복잡한 정보 속에서도 사용자가 여러 제품을 더 쉽게 비교하고, 자신에게
            맞는 냉장고를 스스로 찾을 수 있도록 돕는 것입니다.
          </p>
        </section>

        <div className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="text-sm font-medium text-slate-700 sm:text-base">
            지금 바로 다양한 냉장고를 둘러보세요.
          </p>
          <Link
            href="/#catalog"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            제품 목록 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
