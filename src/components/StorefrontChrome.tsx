"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CompareBar from "./CompareBar";
import BackToTop from "./BackToTop";
import QuickViewModal from "./QuickViewModal";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";

/** Admin has its own layout (sidebar + topbar) — the storefront chrome only wraps customer-facing routes. */
export default function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CompareBar />
      <BackToTop />
      <QuickViewModal />
      <CartDrawer />
      <CartToast />
    </>
  );
}
