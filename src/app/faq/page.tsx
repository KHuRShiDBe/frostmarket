import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import PageIntro from "@/components/PageIntro";
import { buildOpenGraph } from "@/lib/seo";

const title = "자주 묻는 질문 | FrostMarket";
const description = "FrostMarket 자주 묻는 질문 안내.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/faq" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function FaqPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1560px]">
        <PageIntro page="faq" />
        <FaqAccordion />
      </div>
    </main>
  );
}
