"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductGallery({
  title,
  images,
  mainImage,
}: {
  title: string;
  images: string[];
  mainImage: string;
}) {
  const { t } = useLocale();
  const [active, setActive] = useState(mainImage);
  const activeIndex = images.indexOf(active);
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    const wrapped = (index + images.length) % images.length;
    setActive(images[wrapped]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:h-96 sm:p-6 lg:h-[460px]">
        <Image
          src={active}
          alt={t.productPage.productImageAlt(title)}
          fill
          className="object-contain p-2"
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label={t.productPage.prevImage}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:border-sky-300 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label={t.productPage.nextImage}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:border-sky-300 hover:text-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(img)}
              aria-label={t.productPage.imageAtIndex(i + 1)}
              aria-pressed={active === img}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:h-16 sm:w-16 ${
                active === img ? "border-sky-500" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Image
                src={img}
                alt={t.productPage.thumbnailAlt(title, i + 1)}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
