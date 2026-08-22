import type { MetadataRoute } from "next";
import { products } from "@/data/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/faq", "/favorites", "/inquiry"];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
