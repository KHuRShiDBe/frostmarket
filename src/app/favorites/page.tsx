import type { Metadata } from "next";
import FavoritesView from "@/components/FavoritesView";
import PageIntro from "@/components/PageIntro";
import { buildOpenGraph } from "@/lib/seo";

const title = "관심 제품 | FrostMarket";
const description = "FrostMarket에서 저장한 관심 냉장고 목록.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/favorites" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function FavoritesPage() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[92%] max-w-[1560px]">
        <PageIntro page="favorites" />
        <FavoritesView />
      </div>
    </main>
  );
}
