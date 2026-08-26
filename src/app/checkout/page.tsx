import type { Metadata } from "next";
import CheckoutPageContent from "@/components/CheckoutPageContent";
import { buildOpenGraph } from "@/lib/seo";

const title = "결제 | FrostMarket";
const description = "장바구니에 담은 냉장고를 안전하게 결제하세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/checkout" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function CheckoutPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1200px]">
        <CheckoutPageContent />
      </div>
    </main>
  );
}
