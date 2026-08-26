import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import PageIntro from "@/components/PageIntro";
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
        <PageIntro page="inquiry" wrapperClassName="mb-8 flex flex-col gap-1.5 sm:mb-10" />
        <InquiryForm />
      </div>
    </main>
  );
}
