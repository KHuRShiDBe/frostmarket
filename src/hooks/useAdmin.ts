"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { getProductService, type ProductFormInput } from "@/services/products";
import { getOrderRepository, type Order, type OrderStatus } from "@/services/orders";
import { getAuthService, type User } from "@/services/auth";
import { getReviewService, type Review } from "@/services/reviews";
import { computeDashboardMetrics, type DashboardMetrics } from "@/lib/admin/metrics";

/** All products (any status) — Admin → Products. */
export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setProducts(getProductService().getAllProducts());
  }, []);

  useEffect(() => {
    // Client-only hydration from localStorage (via the product service) —
    // can't be a lazy useState initializer without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const createProduct = useCallback(
    (input: ProductFormInput) => {
      const product = getProductService().createProduct(input);
      refresh();
      return product;
    },
    [refresh],
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      const product = getProductService().updateProduct(id, updates);
      refresh();
      return product;
    },
    [refresh],
  );

  return { products, isLoading, createProduct, updateProduct, refresh };
}

/** A single product for Admin → Edit Product. */
export function useAdminProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProduct(getProductService().getProduct(id));
    setIsLoading(false);
  }, [id]);

  const updateProduct = useCallback(
    (updates: Partial<Product>) => {
      const updated = getProductService().updateProduct(id, updates);
      setProduct(updated);
      return updated;
    },
    [id],
  );

  return { product, isLoading, updateProduct };
}

/** Every order, newest first — Admin → Orders. Same OrderRepository the customer's Account → Orders reads. */
export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setOrders(getOrderRepository().getAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const updateOrderStatus = useCallback(
    (orderNumber: string, orderStatus: OrderStatus) => {
      const updated = getOrderRepository().update(orderNumber, { orderStatus });
      refresh();
      return updated;
    },
    [refresh],
  );

  return { orders, isLoading, updateOrderStatus, refresh };
}

/** A single order for Admin → Order Details. */
export function useAdminOrder(orderNumber: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setOrder(getOrderRepository().getByOrderNumber(orderNumber));
  }, [orderNumber]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const updateOrderStatus = useCallback(
    (orderStatus: OrderStatus) => {
      const updated = getOrderRepository().update(orderNumber, { orderStatus });
      if (updated) setOrder(updated);
      return updated;
    },
    [orderNumber],
  );

  return { order, isLoading, updateOrderStatus };
}

export interface AdminCustomerRow {
  user: User;
  ordersCount: number;
  totalSpent: number;
  reviewsCount: number;
}

/** Every registered account plus computed orders/spend/reviews — Admin → Customers. Never includes a password. */
export function useAdminCustomers() {
  const [rows, setRows] = useState<AdminCustomerRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const users = getAuthService().listUsers();
    const orders = getOrderRepository().getAll();
    const reviews = getReviewService().listAll();

    setRows(
      users.map((user) => {
        const userOrders = orders.filter((order) => order.userId === user.id);
        const totalSpent = userOrders
          .filter((order) => order.paymentStatus === "paid")
          .reduce((sum, order) => sum + order.total, 0);
        const reviewsCount = reviews.filter((review) => review.userId === user.id).length;
        return { user, ordersCount: userOrders.length, totalSpent, reviewsCount };
      }),
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  return { rows, isLoading, refresh };
}

/** One customer's profile + orders, for Admin → Customer Details. */
export function useAdminCustomer(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const found = getAuthService()
      .listUsers()
      .find((candidate) => candidate.id === userId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(found ?? null);
    setOrders(
      getOrderRepository()
        .getByUserId(userId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
    setReviewsCount(getReviewService().listForUser(userId).length);
    setIsLoading(false);
  }, [userId]);

  const totalSpent = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);

  return { user, orders, totalSpent, reviewsCount, isLoading };
}

/** Every review across every product — Admin → Reviews moderation. */
export function useAdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setReviews(getReviewService().listAll());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const deleteReview = useCallback(
    (reviewId: string) => {
      const result = getReviewService().adminDeleteReview(reviewId);
      if (result.success) refresh();
      return result.success;
    },
    [refresh],
  );

  return { reviews, isLoading, deleteReview, refresh };
}

/** Dashboard KPIs + a revenue-by-day series, recomputed straight from Orders/Users/Products/Reviews. */
export function useAdminDashboard(revenueRangeDays: 7 | 30) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orders = getOrderRepository().getAll();
    const customersCount = getAuthService().listUsers().length;
    const productsCount = getProductService().getAllProducts().length;
    const reviewRatings = getReviewService()
      .listAll()
      .map((review) => review.rating);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMetrics(computeDashboardMetrics(orders, customersCount, productsCount, reviewRatings, revenueRangeDays));
    setRecentOrders([...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5));
    setIsLoading(false);
  }, [revenueRangeDays]);

  return { metrics, recentOrders, isLoading };
}
