import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/faq", "/favorites", "/inquiry"];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
