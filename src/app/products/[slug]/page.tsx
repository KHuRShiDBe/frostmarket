import type { Metadata } from "next";
import ProductPageContent from "@/components/ProductPageContent";
import {
  getProduct,
  getProductDescription,
  getProductFullName,
  products,
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

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  // Not calling notFound() here: a product added through Admin after the
  // last build won't be in this static seed lookup, but may still exist in
  // the merged (seed + admin overrides/additions) catalog — ProductPageContent
  // resolves that client-side and shows its own not-found state if it's
  // genuinely missing everywhere.
  const product = getProduct(slug) ?? null;

  return <ProductPageContent slug={slug} seedProduct={product} />;
}
