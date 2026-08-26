import type { Product } from "@/data/products";

/**
 * Storage seam for admin-made product changes. The seed catalog in
 * src/data/products.ts is never mutated — instead this repository stores
 * (1) partial "override" patches keyed by product id, applied on top of a
 * product (seed or admin-added) when read, and (2) brand-new products the
 * admin created. ProductService merges these into the effective catalog;
 * the UI never touches localStorage directly, so swapping this for a real
 * backend later doesn't ripple into any component.
 */
export interface ProductRepository {
  getOverrides(): Record<string, Partial<Product>>;
  getAdditions(): Product[];
  saveOverride(id: string, patch: Partial<Product>): void;
  saveAddition(product: Product): void;
}

const OVERRIDES_KEY = "frostmarket:productOverrides";
const ADDITIONS_KEY = "frostmarket:productAdditions";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

/** Demo-only implementation backed by localStorage. Replace with a real API-backed repository later. */
export class LocalStorageProductRepository implements ProductRepository {
  getOverrides(): Record<string, Partial<Product>> {
    return readJson<Record<string, Partial<Product>>>(OVERRIDES_KEY, {});
  }

  getAdditions(): Product[] {
    const value = readJson<Product[]>(ADDITIONS_KEY, []);
    return Array.isArray(value) ? value : [];
  }

  saveOverride(id: string, patch: Partial<Product>): void {
    const overrides = this.getOverrides();
    overrides[id] = { ...overrides[id], ...patch };
    writeJson(OVERRIDES_KEY, overrides);
  }

  saveAddition(product: Product): void {
    const additions = this.getAdditions();
    additions.push(product);
    writeJson(ADDITIONS_KEY, additions);
  }
}
