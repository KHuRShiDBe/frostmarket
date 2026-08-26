import type { Metadata } from "next";
import AdminProductsContent from "@/components/AdminProductsContent";

export const metadata: Metadata = {
  title: "제품 관리 | FrostMarket",
};

export default function AdminProductsPage() {
  return <AdminProductsContent />;
}
