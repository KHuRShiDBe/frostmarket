import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import DemoAdminHint from "@/components/DemoAdminHint";
import { buildOpenGraph } from "@/lib/seo";

const title = "로그인 | FrostMarket";
const description = "FrostMarket 계정으로 로그인하세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/login" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <LoginForm />
        <DemoAdminHint />
      </div>
    </main>
  );
}
