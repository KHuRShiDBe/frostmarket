import type { Metadata } from "next";
import AdminEditProductContent from "@/components/AdminEditProductContent";

export const metadata: Metadata = {
  title: "제품 수정 | FrostMarket",
};

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditProductContent productId={id} />;
}
