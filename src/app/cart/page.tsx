import type { Metadata } from "next";
import CartPageContent from "@/components/CartPageContent";
import PageIntro from "@/components/PageIntro";
import { buildOpenGraph } from "@/lib/seo";

const title = "장바구니 | FrostMarket";
const description = "장바구니에 담은 냉장고를 확인하고 수량을 조정하세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cart" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function CartPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1200px]">
        <PageIntro page="cart" />
        <CartPageContent />
      </div>
    </main>
  );
}
