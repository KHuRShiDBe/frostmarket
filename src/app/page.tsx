import ProductCatalog from "@/components/ProductCatalog";
import { products } from "@/data/products";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 right-[-80px] h-[320px] w-[320px] rounded-full bg-sky-100/60 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto w-[92%] max-w-[1560px] py-8 text-center sm:py-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-sky-700 shadow-sm backdrop-blur">
            프리미엄 냉장고 컬렉션
          </span>

          <h1 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            공간을 완성하는
            <br className="hidden sm:block" /> 프리미엄 냉장고
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            FrostMarket에서 다양한 디자인과 사이즈의 냉장고를 만나보세요.
            마음에 드는 모델을 선택하면 제품 이미지를 자세히 확인할 수
            있습니다.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
            <span className="h-px w-8 bg-slate-300" aria-hidden />
            엄선된 냉장고 컬렉션
            <span className="h-px w-8 bg-slate-300" aria-hidden />
          </div>
        </div>
      </section>

      <section id="catalog" className="scroll-mt-20 py-6 sm:py-8">
        <div className="mx-auto w-[92%] max-w-[1560px]">
          <div className="mb-4 flex flex-col gap-1.5 sm:mb-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              전체 제품
            </span>
            <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              냉장고 컬렉션
            </h2>
          </div>

          <ProductCatalog products={products} />
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-14 sm:py-20"
      >
        <div className="mx-auto w-[92%] max-w-[1560px]">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              FrostMarket 소개
            </span>
            <h2 className="mt-1.5 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              FrostMarket를 소개합니다
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
              FrostMarket는 다양한 냉장고 모델을 한눈에 살펴볼 수 있는
              카탈로그입니다. 실제 촬영된 제품 이미지를 통해 각 모델의
              디자인과 구성을 확인하고, 마음에 드는 냉장고를 찾아보세요.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-20 border-t border-slate-200 py-14 sm:py-20"
      >
        <div className="mx-auto w-[92%] max-w-[1560px]">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              문의하기
            </span>
            <h2 className="mt-1.5 font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
              문의하기
            </h2>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
                연락처 정보는 준비 중입니다.
                <br />
                빠른 시일 내에 업데이트할 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
