import { LocalStorageOrderRepository, type OrderRepository } from "./OrderRepository";

let activeRepository: OrderRepository | null = null;

/**
 * Single point of truth for order storage. Today this resolves to a
 * localStorage-backed demo repository; swapping in a real database/API layer
 * later means writing one new `OrderRepository` implementation here — no
 * changes needed in Checkout or Cart, which only depend on the interface.
 */
export function getOrderRepository(): OrderRepository {
  if (!activeRepository) {
    activeRepository = new LocalStorageOrderRepository();
  }
  return activeRepository;
}

export type { OrderRepository } from "./OrderRepository";
export type {
  CustomerInfo,
  DeliveryMethodId,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "./types";
