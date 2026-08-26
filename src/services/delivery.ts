import type { DeliveryMethodId } from "./orders/types";

export interface DeliveryMethodOption {
  id: DeliveryMethodId;
  /** Demo cost in KRW; 0 means free. */
  cost: number;
}

/** Demo delivery pricing — Express is the only paid option. */
export const DELIVERY_METHODS: DeliveryMethodOption[] = [
  { id: "standard", cost: 0 },
  { id: "express", cost: 15000 },
  { id: "pickup", cost: 0 },
];

export const DEFAULT_DELIVERY_METHOD: DeliveryMethodId = "standard";

export function getDeliveryCost(id: DeliveryMethodId): number {
  return DELIVERY_METHODS.find((method) => method.id === id)?.cost ?? 0;
}
