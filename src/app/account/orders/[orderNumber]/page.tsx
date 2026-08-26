import type { Metadata } from "next";
import AccountOrderDetailContent from "@/components/AccountOrderDetailContent";

export const metadata: Metadata = {
  title: "주문 상세 | FrostMarket",
};

export default async function AccountOrderDetailPage(props: PageProps<"/account/orders/[orderNumber]">) {
  const { orderNumber } = await props.params;
  return <AccountOrderDetailContent orderNumber={orderNumber} />;
}
