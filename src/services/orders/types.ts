export type DeliveryMethodId = "standard" | "express" | "pickup";

export interface OrderItem {
  productId: string;
  model: string;
  brand: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  /** Optional (apartment, suite, floor, ...). */
  apartment: string;
  /** Optional. */
  postalCode: string;
}

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  /** Present only when the order was placed while signed in; absent for guest checkouts. */
  userId?: string;
  items: OrderItem[];
  customer: CustomerInfo;
  deliveryMethod: DeliveryMethodId;
  deliveryCost: number;
  subtotal: number;
  total: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentTransactionId: string;
}
