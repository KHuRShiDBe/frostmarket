import type { Metadata } from "next";
import CheckoutSuccessContent from "@/components/CheckoutSuccessContent";
import { buildOpenGraph } from "@/lib/seo";

const title = "주문 완료 | FrostMarket";
const description = "주문이 정상적으로 접수되었습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/checkout/success" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function CheckoutSuccessPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1200px]">
        <CheckoutSuccessContent />
      </div>
    </main>
  );
}
