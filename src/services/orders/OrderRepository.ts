import type { Order } from "./types";

/**
 * Storage seam for orders. The UI never touches localStorage directly — it
 * only calls through this interface, so swapping in a real backend/database
 * later means writing one new implementation, not touching Checkout/Cart.
 */
export interface OrderRepository {
  /** Allocates a new, unique, human-readable order number (e.g. "FM-20260826-1042"). */
  nextOrderNumber(): string;
  save(order: Order): void;
  getByOrderNumber(orderNumber: string): Order | null;
  getByUserId(userId: string): Order[];
  getAll(): Order[];
  /** Admin-only status changes. Same repository/storage as the customer's Account → Orders, so the change is visible there immediately. */
  update(
    orderNumber: string,
    updates: Partial<Pick<Order, "orderStatus" | "paymentStatus">>,
  ): Order | null;
}

const ORDERS_KEY = "frostmarket:orders";
const SEQUENCE_KEY = "frostmarket:orderSequence";
const SEQUENCE_START = 1000;

/** Older demo orders used "completed" before Shipped/Delivered were split out; treat it as Delivered. */
function normalizeOrder(order: Order): Order {
  const legacyStatus = order.orderStatus as string;
  return legacyStatus === "completed" ? { ...order, orderStatus: "delivered" } : order;
}

function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]): void {
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function formatDateStamp(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/** Demo-only implementation backed by localStorage. Replace with a real API-backed repository later. */
export class LocalStorageOrderRepository implements OrderRepository {
  nextOrderNumber(): string {
    let sequence = SEQUENCE_START;
    try {
      const raw = window.localStorage.getItem(SEQUENCE_KEY);
      sequence = raw ? Number(raw) + 1 : SEQUENCE_START;
    } catch {
      // ignore read failures; fall back to the starting sequence
    }
    try {
      window.localStorage.setItem(SEQUENCE_KEY, String(sequence));
    } catch {
      // ignore write failures
    }
    return `FM-${formatDateStamp(new Date())}-${sequence}`;
  }

  save(order: Order): void {
    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);
  }

  getByOrderNumber(orderNumber: string): Order | null {
    return readOrders().find((order) => order.orderNumber === orderNumber) ?? null;
  }

  getByUserId(userId: string): Order[] {
    return readOrders()
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getAll(): Order[] {
    return readOrders();
  }

  update(
    orderNumber: string,
    updates: Partial<Pick<Order, "orderStatus" | "paymentStatus">>,
  ): Order | null {
    const orders = readOrders();
    const index = orders.findIndex((order) => order.orderNumber === orderNumber);
    if (index === -1) return null;

    const updated = { ...orders[index], ...updates };
    orders[index] = updated;
    writeOrders(orders);
    return updated;
  }
}
