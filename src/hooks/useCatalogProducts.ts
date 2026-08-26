"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { getProductService } from "@/services/products";

/**
 * The shopper-facing product list: starts from a safe static default (the
 * seed catalog, already filtered to "active" — identical to pre-admin
 * behavior) so server and first client render match, then swaps in the true
 * merged list (seed + admin overrides/additions) once mounted. Same
 * hydration-safe pattern as every other localStorage-backed piece of state
 * in this app.
 */
export function useCatalogProducts(initialActiveProducts: Product[]): Product[] {
  const [products, setProducts] = useState<Product[]>(initialActiveProducts);

  useEffect(() => {
    // Client-only upgrade from the static seed default to the true merged
    // catalog (via the product service, which reads localStorage) — can't
    // be a lazy useState initializer without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProducts(getProductService().getActiveProducts());
  }, []);

  return products;
}
