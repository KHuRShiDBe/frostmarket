import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ContactTrigger from "@/components/ContactTrigger";
import FavoriteToggle from "@/components/FavoriteToggle";
import RelatedProductCard from "@/components/RelatedProductCard";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import RecordRecentlyViewed from "@/components/RecordRecentlyViewed";
import {
  getBrandDisplayName,
  getBrandEnglishName,
  getProduct,
  getProductDescription,
  getProductFullName,
  getProductHighlights,
  products,
  SPEC_PENDING,
} from "@/data/products";
import { buildOpenGraph } from "@/lib/seo";

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `${getProductFullName(product)} | FrostMarket`;
  const description = getProductDescription(product);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: buildOpenGraph({ title, description, images: [product.mainImage] }),
  };
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HighlightIcon({ label }: { label: string }) {
  const common = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (label === "용량") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="2" {...common} />
        <path d="M4 10h16" {...common} />
      </svg>
    );
  }
  if (label === "도어 타입") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="6" y="3" width="12" height="18" rx="1.5" {...common} />
        <path d="M14.5 12h.01" {...common} />
      </svg>
    );
  }
  if (label === "색상") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" {...common} />
        <circle cx="12" cy="12" r="2.8" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" {...common} />
    </svg>
  );
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const specRows = [
    { label: "브랜드", value: product.brand },
    { label: "모델명", value: product.model },
    { label: "제품명", value: product.productName },
    { label: "총 용량", value: product.totalCapacity },
    { label: "냉장실 용량", value: product.fridgeCapacity },
    { label: "냉동실 용량", value: product.freezerCapacity },
    { label: "크기 (W×H×D)", value: product.dimensions },
    { label: "크기 (후면핸들 포함)", value: product.dimensionsWithHandle },
    { label: "크기 (후면핸들 미포함)", value: product.dimensionsWithoutHandle },
    { label: "후면핸들 미포함 깊이", value: product.depthWithoutHandle },
    { label: "제품 타입", value: product.productType },
    { label: "타입", value: product.layoutType },
    { label: "설치 타입", value: product.installationType },
    { label: "도어 타입", value: product.doorType },
    { label: "도어 디자인", value: product.doorDesign },
    { label: "도어 재질", value: product.doorMaterial },
    { label: "핸들", value: product.handleType },
    { label: "색상", value: product.color },
    { label: "재질", value: product.material },
    { label: "에너지 소비효율등급", value: product.energyGrade },
    { label: "월 소비전력", value: product.monthlyPowerConsumption },
    { label: "정격 전압", value: product.ratedVoltage },
    { label: "컴프레서", value: product.compressor },
    { label: "냉매", value: product.refrigerant },
    { label: "냉각방식", value: product.coolingType },
    { label: "소음", value: product.noiseLevel },
    { label: "자동 문열림", value: product.autoDoorOpen },
    { label: "무게", value: product.weight },
    { label: "디스펜서", value: product.dispenser },
    { label: "푸드 쇼케이스", value: product.foodShowcase },
    { label: "투명 쇼케이스", value: product.transparentShowcase },
    { label: "베버리지존", value: product.beverageZone },
    { label: "매직스페이스", value: product.magicSpace },
    { label: "제빙기", value: product.iceMaker },
    { label: "얼음 종류", value: product.iceType },
    { label: "탈취", value: product.deodorizing },
    { label: "디스플레이", value: product.display },
    { label: "내부조명", value: product.interiorLighting },
    { label: "AI 비전 인사이드", value: product.aiVisionInside },
    { label: "Wi-Fi", value: product.wifi },
    { label: "SmartThings", value: product.smartThings },
    { label: "Bixby", value: product.bixby },
    { label: "스마트 진단", value: product.smartDiagnosis },
    { label: "UP 가전", value: product.upAppliance },
    { label: "제조사", value: product.manufacturer },
    { label: "제조국", value: product.countryOfOrigin },
    { label: "출시 정보", value: product.releaseInfo },
  ];

  const brandDisplay = getBrandDisplayName(product.brand);
  const brandEnglish = getBrandEnglishName(product.brand);
  const highlights = getProductHighlights(product);
  const brandPending = brandDisplay === SPEC_PENDING;

  // 브랜드가 확인된 경우에만, 같은(확인된) 브랜드의 다른 제품을 추천한다.
  const similarProducts =
    product.brand !== SPEC_PENDING
      ? products.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 3)
      : [];

  // 상단 갤러리에서 이미 보여준 대표 이미지를 제외한 나머지 이미지
  const remainingImages = product.images.filter((img) => img !== product.mainImage);

  return (
    <main className="flex-1 bg-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-[94%] max-w-[1400px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-600"
        >
          ← 제품 목록
        </Link>

        {/* Main product area */}
        <div className="grid gap-10 lg:grid-cols-[9fr_11fr] lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ProductGallery
              title={getProductFullName(product)}
              images={product.images}
              mainImage={product.mainImage}
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-bold uppercase tracking-wide sm:text-base ${
                      brandPending ? "italic text-slate-400" : "text-sky-600"
                    }`}
                  >
                    {brandDisplay}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    냉장고
                  </span>
                </div>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
                  {product.model}
                </h1>
              </div>
              <FavoriteToggle productId={product.id} model={product.model} variant="inline" />
            </div>

            {/* 액션 버튼 */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ContactTrigger productId={product.id} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto">
                <MessageIcon />
                구매 문의
              </ContactTrigger>
              <FavoriteToggle productId={product.id} model={product.model} variant="pill" />
            </div>

            {/* 브랜드 정보 카드 */}
            {brandEnglish && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-50 font-heading text-base font-bold text-sky-600">
                  {brandDisplay.charAt(0)}
                </span>
                <div>
                  <p className="font-heading text-base font-bold text-slate-900">{brandDisplay}</p>
                  <p className="text-sm text-slate-400">{brandEnglish}</p>
                </div>
              </div>
            )}

            {/* 제품 하이라이트 */}
            {highlights.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="text-sky-600">
                      <HighlightIcon label={item.label} />
                    </span>
                    <div>
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 주요 사양 */}
        <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            제품 정보
          </span>
          <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            주요 사양
          </h2>

          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm sm:grid-cols-2 sm:max-w-2xl">
            {specRows.map((row) => {
              const isPending = row.value === SPEC_PENDING;
              return (
                <div key={row.label} className="flex flex-col gap-1 bg-white px-5 py-4">
                  <dt className="text-xs text-slate-400">{row.label}</dt>
                  <dd
                    className={
                      isPending
                        ? "text-sm italic text-slate-400"
                        : "text-sm font-semibold text-slate-900"
                    }
                  >
                    {row.value}
                  </dd>
                </div>
              );
            })}
            <div className="flex flex-col gap-1 bg-white px-5 py-4 sm:col-span-2">
              <dt className="text-xs text-slate-400">주요 기능</dt>
              {product.keyFeatures.length > 0 ? (
                <dd>
                  <ul className="list-disc space-y-1 pl-5 text-sm font-semibold text-slate-900">
                    {product.keyFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </dd>
              ) : (
                <dd className="text-sm italic text-slate-400">{SPEC_PENDING}</dd>
              )}
            </div>
          </dl>

          {product.notes && (
            <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:max-w-xl">
              {product.notes}
            </p>
          )}

          <p className="mt-4 text-sm text-slate-400">
            &ldquo;{SPEC_PENDING}&rdquo;으로 표시된 항목은 아직 확정되지 않은
            사양이며, 확인되는 대로 업데이트할 예정입니다.
          </p>
        </section>

        {/* 제품 이미지 */}
        {remainingImages.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              제품 이미지
            </span>
            <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
              제품 이미지
            </h2>

            <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-6">
              {remainingImages.map((img, i) => (
                <div
                  key={img}
                  className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[480px] sm:aspect-auto"
                >
                  <Image
                    src={img}
                    alt={`${getProductFullName(product)} 제품 이미지 ${i + 2}`}
                    fill
                    className="object-contain p-6"
                    sizes="(min-width: 640px) 672px, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 비슷한 제품 */}
        {similarProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              비슷한 제품
            </span>
            <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
              비슷한 제품
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {similarProducts.map((similar) => (
                <RelatedProductCard key={similar.id} product={similar} />
              ))}
            </div>
          </section>
        )}

        {/* 최근 본 제품 */}
        <RecentlyViewedSection currentProductId={product.id} />

        {/* 배송 및 문의 */}
        <section
          id="inquiry"
          className="mt-16 scroll-mt-24 border-t border-slate-200 pt-10 sm:mt-20 sm:pt-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            배송 및 문의
          </span>
          <h2 className="mt-1.5 font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            구매 및 배송 문의
          </h2>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-slate-500 sm:text-base">
              구매 및 배송 관련 문의 방법은 준비 중입니다.
              <br />
              빠른 시일 내에 안내해 드리겠습니다.
            </p>
          </div>
        </section>

        {/* 문의 CTA */}
        <section className="mt-16 border-t border-slate-200 pt-10 text-center sm:mt-20 sm:pt-12">
          <h2 className="font-heading text-xl font-bold text-slate-900 sm:text-2xl">
            제품에 대해 궁금하신가요?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            FrostMarket에 문의하시면 안내해 드리겠습니다.
          </p>
          <ContactTrigger productId={product.id} className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2">
            <MessageIcon />
            구매 문의
          </ContactTrigger>
        </section>
      </div>

      <RecordRecentlyViewed productId={product.id} />
    </main>
  );
}
