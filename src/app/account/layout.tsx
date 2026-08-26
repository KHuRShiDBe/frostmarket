import type { ReactNode } from "react";
import AccountLayoutShell from "@/components/AccountLayoutShell";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountLayoutShell>{children}</AccountLayoutShell>;
}
