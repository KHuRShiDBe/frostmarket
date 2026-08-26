import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { buildOpenGraph } from "@/lib/seo";

const title = "비밀번호 찾기 | FrostMarket";
const description = "비밀번호를 잊으셨나요? 안내에 따라 재설정해 보세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/forgot-password" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
