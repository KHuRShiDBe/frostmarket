import type { ProductStatus } from "@/data/products";

/**
 * Fields an admin actually fills in on Add Product. Every other Product spec
 * field defaults to SPEC_PENDING/empty on create — this app never invents a
 * confirmed value for a spec nobody actually provided (see SPEC_PENDING in
 * src/data/products.ts).
 */
export interface ProductFormInput {
  brand: string;
  model: string;
  price: number;
  /** Pre-formatted, e.g. "500 L" — matches the existing `totalCapacity` convention. */
  totalCapacity: string;
  doorType: string;
  color: string;
  /** e.g. "1등급" — matches the existing `energyGrade` convention. */
  energyGrade: string;
  wifi: string;
  iceMaker: string;
  dispenser: string;
  mainImage: string;
  images: string[];
  stock: number;
  status: ProductStatus;
}
