import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";
import CompareModal from "@/components/CompareModal";
import BackToTop from "@/components/BackToTop";
import QuickViewModal from "@/components/QuickViewModal";
import { CompareProvider } from "@/context/CompareContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { QuickViewProvider } from "@/context/QuickViewContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { buildOpenGraph, SITE_URL } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const title = "FrostMarket | 냉장고 비교 및 제품 정보";
const description = "LG전자와 삼성전자 냉장고 모델을 한눈에 확인하고 비교해 보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-body text-slate-900">
        <FavoritesProvider>
          <CompareProvider>
            <QuickViewProvider>
              <RecentlyViewedProvider>
                <Header />
                {children}
                <Footer />
                <CompareBar />
                <CompareModal />
                <BackToTop />
                <QuickViewModal />
              </RecentlyViewedProvider>
            </QuickViewProvider>
          </CompareProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
