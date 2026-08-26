import type { Metadata } from "next";
import AdminOrderDetailContent from "@/components/AdminOrderDetailContent";

export const metadata: Metadata = {
  title: "주문 상세 | FrostMarket",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return <AdminOrderDetailContent orderNumber={decodeURIComponent(orderNumber)} />;
}
