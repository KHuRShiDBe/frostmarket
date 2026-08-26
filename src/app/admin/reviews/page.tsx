import type { Metadata } from "next";
import AdminReviewsContent from "@/components/AdminReviewsContent";

export const metadata: Metadata = {
  title: "리뷰 관리 | FrostMarket",
};

export default function AdminReviewsPage() {
  return <AdminReviewsContent />;
}
