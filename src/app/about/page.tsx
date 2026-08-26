import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import PageIntro from "@/components/PageIntro";
import { buildOpenGraph } from "@/lib/seo";

const title = "FrostMarket 소개 | FrostMarket";
const description = "FrostMarket가 어떤 서비스인지 소개합니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function AboutPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1560px]">
        <PageIntro page="about" wrapperClassName="mb-10 flex flex-col gap-1.5 sm:mb-14" />
        <AboutContent />
      </div>
    </main>
  );
}
