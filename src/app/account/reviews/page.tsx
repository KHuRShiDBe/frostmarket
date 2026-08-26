import type { Metadata } from "next";
import AccountReviewsContent from "@/components/AccountReviewsContent";

export const metadata: Metadata = {
  title: "내 리뷰 | FrostMarket",
  alternates: { canonical: "/account/reviews" },
};

export default function AccountReviewsPage() {
  return <AccountReviewsContent />;
}
