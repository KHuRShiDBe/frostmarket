import type { Metadata } from "next";
import AccountRecentlyViewedContent from "@/components/AccountRecentlyViewedContent";

export const metadata: Metadata = {
  title: "최근 본 제품 | FrostMarket",
  alternates: { canonical: "/account/recently-viewed" },
};

export default function AccountRecentlyViewedPage() {
  return <AccountRecentlyViewedContent />;
}
