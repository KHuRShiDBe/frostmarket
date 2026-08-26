import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import { buildOpenGraph } from "@/lib/seo";

const title = "회원가입 | FrostMarket";
const description = "FrostMarket 계정을 만들어 보세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/register" },
  openGraph: buildOpenGraph({ title, description }),
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}
