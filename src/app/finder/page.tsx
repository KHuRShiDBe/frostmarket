import type { Metadata } from "next";
import FinderWizard from "@/components/FinderWizard";
import PageIntro from "@/components/PageIntro";
import { products } from "@/data/products";
import { buildOpenGraph } from "@/lib/seo";

const title = "냉장고 추천받기 | FrostMarket";
const description = "몇 가지 질문에 답하면 나에게 맞는 냉장고를 추천해 드립니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/finder" },
  openGraph: buildOpenGraph({ title, description }),
};

const INITIAL_ACTIVE_PRODUCTS = products.filter((product) => product.status === "active");

export default function FinderPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1200px]">
        <PageIntro page="finder" wrapperClassName="mb-8 flex flex-col items-center gap-1.5 text-center sm:mb-12" />
        <FinderWizard products={INITIAL_ACTIVE_PRODUCTS} />
      </div>
    </main>
  );
}
