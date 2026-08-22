import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="text-xs uppercase tracking-wide text-sky-600">
        404
      </span>
      <h1 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="max-w-sm text-sm text-slate-500">
        요청하신 냉장고 제품을 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-1 text-sm text-sky-600 transition-colors hover:text-sky-700"
      >
        ← 제품 목록으로 돌아가기
      </Link>
    </main>
  );
}
