import type { Metadata } from "next";
import AdminSettingsContent from "@/components/AdminSettingsContent";

export const metadata: Metadata = {
  title: "설정 | FrostMarket",
};

export default function AdminSettingsPage() {
  return <AdminSettingsContent />;
}
