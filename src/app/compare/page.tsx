import type { Metadata } from "next";
import CompareView from "@/components/CompareView";
import PageIntro from "@/components/PageIntro";
import { buildOpenGraph } from "@/lib/seo";

const title = "냉장고 비교 | FrostMarket";
const description = "선택한 냉장고들의 사양을 한눈에 비교해 보세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/compare" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function ComparePage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1560px]">
        <PageIntro page="compare" />
        <CompareView />
      </div>
    </main>
  );
}
