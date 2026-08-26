import type { Metadata } from "next";
import AdminOrdersContent from "@/components/AdminOrdersContent";

export const metadata: Metadata = {
  title: "주문 관리 | FrostMarket",
};

export default function AdminOrdersPage() {
  return <AdminOrdersContent />;
}
