import type { Metadata } from "next";
import AdminCustomerDetailContent from "@/components/AdminCustomerDetailContent";

export const metadata: Metadata = {
  title: "고객 상세 | FrostMarket",
};

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminCustomerDetailContent userId={id} />;
}
