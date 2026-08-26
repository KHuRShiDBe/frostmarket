import type { Metadata } from "next";
import AdminDashboardContent from "@/components/AdminDashboardContent";

export const metadata: Metadata = {
  title: "관리자 대시보드 | FrostMarket",
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
