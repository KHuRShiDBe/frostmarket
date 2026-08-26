import type { Metadata } from "next";
import AccountOrdersContent from "@/components/AccountOrdersContent";

export const metadata: Metadata = {
  title: "주문 내역 | FrostMarket",
  alternates: { canonical: "/account/orders" },
};

export default function AccountOrdersPage() {
  return <AccountOrdersContent />;
}
