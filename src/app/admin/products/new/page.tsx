import type { Metadata } from "next";
import AdminNewProductContent from "@/components/AdminNewProductContent";

export const metadata: Metadata = {
  title: "제품 추가 | FrostMarket",
};

export default function AdminNewProductPage() {
  return <AdminNewProductContent />;
}
