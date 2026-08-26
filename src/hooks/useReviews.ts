"use client";

import { useCallback, useEffect, useState } from "react";
import { getReviewService } from "@/services/reviews";
import type { RatingSummary, Review, ReviewInput, ReviewResult, ReviewUpdateInput } from "@/services/reviews";

const EMPTY_SUMMARY: RatingSummary = { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };

interface UseProductReviewsResult {
  reviews: Review[];
  summary: RatingSummary;
  isLoading: boolean;
  /** The current user's own review for this product, if they've written one. */
  ownReview: Review | null;
  createReview: (input: Omit<ReviewInput, "productId">) => ReviewResult;
  updateReview: (reviewId: string, updates: ReviewUpdateInput) => ReviewResult;
  deleteReview: (reviewId: string) => boolean;
  toggleHelpful: (reviewId: string) => void;
}

/**
 * Loads and mutates reviews for a single product, client-side only (like
 * Orders, this reads localStorage directly rather than through a Context —
 * reviews are only ever needed on the Product Page and Account, not
 * app-wide). Renders empty on the server and hydrates on mount to avoid a
 * hydration mismatch, matching every other localStorage-backed piece of
 * state in this app.
 */
export function useProductReviews(productId: string, currentUserId: string | null): UseProductReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<RatingSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const service = getReviewService();
    setReviews(service.listForProduct(productId));
    setSummary(service.getRatingSummary(productId));
  }, [productId]);

  useEffect(() => {
    // Client-only hydration from localStorage (via the review service), same
    // as every other localStorage-backed piece of state in this app — SSR
    // renders empty to avoid a hydration mismatch, so this can't be a lazy
    // useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const createReview = useCallback(
    (input: Omit<ReviewInput, "productId">): ReviewResult => {
      const result = getReviewService().createReview({ ...input, productId });
      if (result.success) refresh();
      return result;
    },
    [productId, refresh],
  );

  const updateReview = useCallback(
    (reviewId: string, updates: ReviewUpdateInput): ReviewResult => {
      if (!currentUserId) return { success: false, error: "not_authenticated" };
      const result = getReviewService().updateReview(reviewId, currentUserId, updates);
      if (result.success) refresh();
      return result;
    },
    [currentUserId, refresh],
  );

  const deleteReview = useCallback(
    (reviewId: string): boolean => {
      if (!currentUserId) return false;
      const result = getReviewService().deleteReview(reviewId, currentUserId);
      if (result.success) refresh();
      return result.success;
    },
    [currentUserId, refresh],
  );

  const toggleHelpful = useCallback(
    (reviewId: string) => {
      if (!currentUserId) return;
      const result = getReviewService().toggleHelpful(reviewId, currentUserId);
      if (result.success) refresh();
    },
    [currentUserId, refresh],
  );

  const ownReview = currentUserId ? (reviews.find((review) => review.userId === currentUserId) ?? null) : null;

  return { reviews, summary, isLoading, ownReview, createReview, updateReview, deleteReview, toggleHelpful };
}

interface UseUserReviewsResult {
  reviews: Review[];
  isLoading: boolean;
  updateReview: (reviewId: string, updates: ReviewUpdateInput) => ReviewResult;
  deleteReview: (reviewId: string) => boolean;
}

/** Loads and mutates every review written by one user, for Account → My Reviews. */
export function useUserReviews(userId: string | null): UseUserReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setReviews(userId ? getReviewService().listForUser(userId) : []);
  }, [userId]);

  useEffect(() => {
    // Client-only hydration from localStorage (via the review service); see
    // useProductReviews above for why this can't be a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const updateReview = useCallback(
    (reviewId: string, updates: ReviewUpdateInput): ReviewResult => {
      if (!userId) return { success: false, error: "not_authenticated" };
      const result = getReviewService().updateReview(reviewId, userId, updates);
      if (result.success) refresh();
      return result;
    },
    [userId, refresh],
  );

  const deleteReview = useCallback(
    (reviewId: string): boolean => {
      if (!userId) return false;
      const result = getReviewService().deleteReview(reviewId, userId);
      if (result.success) refresh();
      return result.success;
    },
    [userId, refresh],
  );

  return { reviews, isLoading, updateReview, deleteReview };
}
