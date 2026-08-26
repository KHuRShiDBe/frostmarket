import type { Metadata } from "next";
import AdminCustomersContent from "@/components/AdminCustomersContent";

export const metadata: Metadata = {
  title: "고객 관리 | FrostMarket",
};

export default function AdminCustomersPage() {
  return <AdminCustomersContent />;
}
