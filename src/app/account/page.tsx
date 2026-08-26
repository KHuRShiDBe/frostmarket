import type { Metadata } from "next";
import AccountDashboardContent from "@/components/AccountDashboardContent";

export const metadata: Metadata = {
  title: "내 계정 | FrostMarket",
  alternates: { canonical: "/account" },
};

export default function AccountPage() {
  return <AccountDashboardContent />;
}
