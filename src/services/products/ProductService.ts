import { products as seedProducts, SPEC_PENDING, type Product } from "@/data/products";
import type { ProductRepository } from "./ProductRepository";
import type { ProductFormInput } from "./types";

/**
 * Everything Catalog/Cart/Checkout/Admin need to read or change product
 * data, expressed as an interface. UI code only ever depends on this —
 * never on LocalStorageProductRepository directly — so a real backend can
 * replace DemoProductService later without touching a single component.
 */
export interface ProductService {
  /** Seed catalog with admin overrides applied, plus admin-added products. */
  getAllProducts(): Product[];
  /** The subset shoppers may browse — status === "active" only. */
  getActiveProducts(): Product[];
  getProduct(id: string): Product | null;
  createProduct(input: ProductFormInput): Product;
  updateProduct(id: string, updates: Partial<Product>): Product | null;
  hasSufficientStock(id: string, quantity: number): boolean;
  /** Called once per purchased line after a successful payment; auto-flips status to "outOfStock" at 0. */
  decrementStock(id: string, quantity: number): void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function generateProductId(model: string, existingIds: Set<string>): string {
  const base = slugify(model) || "product";
  if (!existingIds.has(base)) return base;
  let suffix = 2;
  while (existingIds.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

/** Builds a full Product from only the fields an admin actually provided — every unconfirmed spec stays SPEC_PENDING, never invented. */
function buildNewProduct(input: ProductFormInput, id: string): Product {
  return {
    id,
    model: input.model.trim(),
    price: input.price,
    mainImage: input.mainImage,
    images: input.images,
    brand: input.brand,
    capacity: SPEC_PENDING,
    dimensions: SPEC_PENDING,
    color: input.color.trim() || SPEC_PENDING,
    energyGrade: input.energyGrade,
    doorType: input.doorType,
    countryOfOrigin: SPEC_PENDING,
    warranty: SPEC_PENDING,
    totalCapacity: input.totalCapacity,
    fridgeCapacity: SPEC_PENDING,
    freezerCapacity: SPEC_PENDING,
    manufacturer: SPEC_PENDING,
    releaseInfo: SPEC_PENDING,
    keyFeatures: [],
    productName: input.model.trim(),
    productType: SPEC_PENDING,
    installationType: SPEC_PENDING,
    monthlyPowerConsumption: SPEC_PENDING,
    ratedVoltage: SPEC_PENDING,
    compressor: SPEC_PENDING,
    refrigerant: SPEC_PENDING,
    coolingType: SPEC_PENDING,
    weight: SPEC_PENDING,
    doorDesign: SPEC_PENDING,
    dispenser: input.dispenser,
    iceMaker: input.iceMaker,
    wifi: input.wifi,
    smartThings: SPEC_PENDING,
    material: SPEC_PENDING,
    dimensionsWithHandle: SPEC_PENDING,
    dimensionsWithoutHandle: SPEC_PENDING,
    iceType: SPEC_PENDING,
    deodorizing: SPEC_PENDING,
    display: SPEC_PENDING,
    foodShowcase: SPEC_PENDING,
    bixby: SPEC_PENDING,
    autoDoorOpen: SPEC_PENDING,
    aiVisionInside: SPEC_PENDING,
    transparentShowcase: SPEC_PENDING,
    beverageZone: SPEC_PENDING,
    interiorLighting: SPEC_PENDING,
    doorMaterial: SPEC_PENDING,
    handleType: SPEC_PENDING,
    smartDiagnosis: SPEC_PENDING,
    depthWithoutHandle: SPEC_PENDING,
    layoutType: SPEC_PENDING,
    noiseLevel: SPEC_PENDING,
    magicSpace: SPEC_PENDING,
    upAppliance: SPEC_PENDING,
    notes: "",
    stock: input.stock,
    status: input.status,
  };
}

/**
 * Demo-only implementation. The static seed array is the base catalog and is
 * never mutated; admin edits/additions live in localStorage via
 * ProductRepository and are merged in on every read. Swap this for a real
 * backend-backed implementation later — the ProductRepository seam already
 * isolates storage concerns so that swap doesn't ripple into the UI.
 */
export class DemoProductService implements ProductService {
  constructor(private readonly repo: ProductRepository) {}

  getAllProducts(): Product[] {
    const overrides = this.repo.getOverrides();
    const applyOverride = (product: Product): Product => {
      const patch = overrides[product.id];
      return patch ? { ...product, ...patch } : product;
    };
    return [...seedProducts.map(applyOverride), ...this.repo.getAdditions().map(applyOverride)];
  }

  getActiveProducts(): Product[] {
    return this.getAllProducts().filter((product) => product.status === "active");
  }

  getProduct(id: string): Product | null {
    return this.getAllProducts().find((product) => product.id === id) ?? null;
  }

  createProduct(input: ProductFormInput): Product {
    const existingIds = new Set(this.getAllProducts().map((product) => product.id));
    const id = generateProductId(input.model, existingIds);
    const product = buildNewProduct(input, id);
    this.repo.saveAddition(product);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    if (!this.getProduct(id)) return null;
    this.repo.saveOverride(id, updates);
    return this.getProduct(id);
  }

  hasSufficientStock(id: string, quantity: number): boolean {
    const product = this.getProduct(id);
    return !!product && product.status !== "outOfStock" && product.stock >= quantity;
  }

  decrementStock(id: string, quantity: number): void {
    const product = this.getProduct(id);
    if (!product) return;

    const nextStock = Math.max(0, product.stock - quantity);
    const patch: Partial<Product> = { stock: nextStock };
    if (nextStock === 0 && product.status === "active") patch.status = "outOfStock";
    this.repo.saveOverride(id, patch);
  }
}
