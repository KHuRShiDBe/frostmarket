import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ContactTrigger from "./ContactTrigger";

const linkClass = "text-sm text-slate-500 transition-colors hover:text-sky-600";

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </span>
      <nav className="flex flex-col gap-2.5">{children}</nav>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-[92%] max-w-[1560px] py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-x-12">
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-4 lg:col-span-1">
            <Link
              href="/"
              aria-label="FrostMarket — 홈으로"
              className="w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
            >
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              다양한 냉장고를 한눈에 비교하고 확인하세요.
            </p>
          </div>

          <FooterColumn title="제품">
            <Link href="/#catalog" className={linkClass}>
              전체 제품
            </Link>
            <Link href="/?brand=LG#catalog" className={linkClass}>
              LG
            </Link>
            <Link href="/?brand=Samsung#catalog" className={linkClass}>
              Samsung
            </Link>
            <Link href="/favorites" className={linkClass}>
              관심 제품
            </Link>
          </FooterColumn>

          <FooterColumn title="고객 지원">
            <ContactTrigger className={`w-fit text-left ${linkClass}`}>구매 문의</ContactTrigger>
            <Link href="/faq" className={linkClass}>
              자주 묻는 질문
            </Link>
          </FooterColumn>

          <FooterColumn title="FrostMarket">
            <Link href="/about" className={linkClass}>
              회사 소개
            </Link>
          </FooterColumn>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 sm:mt-12">
          <p className="text-xs text-slate-400">
            © {year} FrostMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
