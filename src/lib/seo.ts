import type { Metadata } from "next";

export const SITE_NAME = "FrostMarket";

/** Canonical production origin, overridable for non-default deployments. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://frostmarket.vercel.app";

/** Builds a self-contained Open Graph object (Next does not deep-merge nested metadata fields). */
export function buildOpenGraph({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images?: string[];
}): Metadata["openGraph"] {
  return {
    title,
    description,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    images,
  };
}
