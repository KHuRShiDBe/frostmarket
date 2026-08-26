import { DemoProductService, type ProductService } from "./ProductService";
import { LocalStorageProductRepository } from "./ProductRepository";

let activeService: ProductService | null = null;

/**
 * Single point of truth for product data. Today this resolves to the static
 * seed catalog merged with localStorage-backed admin edits/additions;
 * swapping in a real backend/database later means writing one new
 * `ProductService` implementation here — no changes needed in the Catalog,
 * Cart, Checkout, or Admin, which only depend on the interface.
 */
export function getProductService(): ProductService {
  if (!activeService) {
    activeService = new DemoProductService(new LocalStorageProductRepository());
  }
  return activeService;
}

export type { ProductService } from "./ProductService";
export type { ProductRepository } from "./ProductRepository";
export type { ProductFormInput } from "./types";
