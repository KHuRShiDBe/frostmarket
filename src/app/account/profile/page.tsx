import type { Metadata } from "next";
import AccountProfileContent from "@/components/AccountProfileContent";

export const metadata: Metadata = {
  title: "프로필 | FrostMarket",
  alternates: { canonical: "/account/profile" },
};

export default function AccountProfilePage() {
  return <AccountProfileContent />;
}
