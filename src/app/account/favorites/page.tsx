import type { Metadata } from "next";
import AccountFavoritesContent from "@/components/AccountFavoritesContent";

export const metadata: Metadata = {
  title: "관심 제품 | FrostMarket",
  alternates: { canonical: "/account/favorites" },
};

export default function AccountFavoritesPage() {
  return <AccountFavoritesContent />;
}
