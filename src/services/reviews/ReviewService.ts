import type { ReviewRepository } from "./ReviewRepository";
import type { OrderRepository } from "../orders/OrderRepository";
import type {
  RatingSummary,
  Review,
  ReviewErrorCode,
  ReviewInput,
  ReviewResult,
  ReviewUpdateInput,
  StoredReview,
} from "./types";

type SimpleResult = { success: true } | { success: false; error: ReviewErrorCode };
type HelpfulResult = { success: true; review: Review } | { success: false; error: ReviewErrorCode };

/**
 * Everything the Product Page / Account Reviews need from the review system,
 * expressed as an interface. UI code only ever depends on this — never on
 * LocalStorageReviewRepository directly — so a real backend can replace
 * DemoReviewService later without touching a single component.
 */
export interface ReviewService {
  listForProduct(productId: string): Review[];
  listForUser(userId: string): Review[];
  /** Every review across every product — Admin → Reviews moderation only. */
  listAll(): Review[];
  getUserReviewForProduct(productId: string, userId: string): Review | null;
  getRatingSummary(productId: string): RatingSummary;
  createReview(input: ReviewInput): ReviewResult;
  updateReview(reviewId: string, userId: string, updates: ReviewUpdateInput): ReviewResult;
  deleteReview(reviewId: string, userId: string): SimpleResult;
  /** Admin moderation: deletes any review regardless of ownership. Gate who may call this at the route/UI level. */
  adminDeleteReview(reviewId: string): SimpleResult;
  toggleHelpful(reviewId: string, userId: string): HelpfulResult;
}

function generateReviewId(): string {
  return `review_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Demo-only implementation. Reuses the existing Orders system (never a second
 * one) purely to compute `verifiedPurchase` on read — that flag is never
 * stored on the review itself, so it can't drift from the real purchase
 * history. Swap this for a real backend-backed implementation later; the
 * ReviewRepository/OrderRepository seam already isolates storage concerns so
 * that swap doesn't ripple into the UI.
 */
export class DemoReviewService implements ReviewService {
  constructor(
    private readonly reviews: ReviewRepository,
    private readonly orders: OrderRepository,
  ) {}

  private isVerifiedPurchase(productId: string, userId: string): boolean {
    return this.orders
      .getByUserId(userId)
      .some(
        (order) =>
          order.paymentStatus !== "failed" && order.items.some((item) => item.productId === productId),
      );
  }

  private toReview(stored: StoredReview): Review {
    return {
      ...stored,
      helpfulCount: stored.helpfulUserIds.length,
      verifiedPurchase: this.isVerifiedPurchase(stored.productId, stored.userId),
    };
  }

  listForProduct(productId: string): Review[] {
    return this.reviews.getByProductId(productId).map((stored) => this.toReview(stored));
  }

  listForUser(userId: string): Review[] {
    return this.reviews.getByUserId(userId).map((stored) => this.toReview(stored));
  }

  listAll(): Review[] {
    return this.reviews.getAll().map((stored) => this.toReview(stored));
  }

  getUserReviewForProduct(productId: string, userId: string): Review | null {
    const stored = this.reviews.getByProductAndUser(productId, userId);
    return stored ? this.toReview(stored) : null;
  }

  getRatingSummary(productId: string): RatingSummary {
    const productReviews = this.reviews.getByProductId(productId);
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const review of productReviews) {
      const bucket = Math.round(review.rating);
      if (bucket >= 1 && bucket <= 5) distribution[bucket as 1 | 2 | 3 | 4 | 5] += 1;
    }

    const count = productReviews.length;
    const average = count === 0 ? 0 : productReviews.reduce((sum, review) => sum + review.rating, 0) / count;

    return { average, count, distribution };
  }

  createReview(input: ReviewInput): ReviewResult {
    if (!isValidRating(input.rating)) return { success: false, error: "invalid_rating" };
    if (!input.text.trim()) return { success: false, error: "text_required" };
    if (this.reviews.getByProductAndUser(input.productId, input.userId)) {
      return { success: false, error: "already_reviewed" };
    }

    const now = new Date().toISOString();
    const stored: StoredReview = {
      id: generateReviewId(),
      productId: input.productId,
      userId: input.userId,
      userName: input.userName,
      rating: input.rating,
      title: input.title?.trim() ?? "",
      text: input.text.trim(),
      createdAt: now,
      updatedAt: now,
      helpfulUserIds: [],
      isSeed: false,
    };

    this.reviews.create(stored);
    return { success: true, review: this.toReview(stored) };
  }

  updateReview(reviewId: string, userId: string, updates: ReviewUpdateInput): ReviewResult {
    const existing = this.reviews.getById(reviewId);
    if (!existing) return { success: false, error: "not_found" };
    if (existing.userId !== userId) return { success: false, error: "forbidden" };
    if (!isValidRating(updates.rating)) return { success: false, error: "invalid_rating" };
    if (!updates.text.trim()) return { success: false, error: "text_required" };

    const updated = this.reviews.update(reviewId, {
      rating: updates.rating,
      title: updates.title?.trim() ?? "",
      text: updates.text.trim(),
      updatedAt: new Date().toISOString(),
    });
    if (!updated) return { success: false, error: "unknown_error" };
    return { success: true, review: this.toReview(updated) };
  }

  deleteReview(reviewId: string, userId: string): SimpleResult {
    const existing = this.reviews.getById(reviewId);
    if (!existing) return { success: false, error: "not_found" };
    if (existing.userId !== userId) return { success: false, error: "forbidden" };

    const deleted = this.reviews.delete(reviewId);
    return deleted ? { success: true } : { success: false, error: "unknown_error" };
  }

  adminDeleteReview(reviewId: string): SimpleResult {
    const existing = this.reviews.getById(reviewId);
    if (!existing) return { success: false, error: "not_found" };

    const deleted = this.reviews.delete(reviewId);
    return deleted ? { success: true } : { success: false, error: "unknown_error" };
  }

  toggleHelpful(reviewId: string, userId: string): HelpfulResult {
    const existing = this.reviews.getById(reviewId);
    if (!existing) return { success: false, error: "not_found" };
    if (existing.userId === userId) return { success: false, error: "forbidden" };

    const alreadyVoted = existing.helpfulUserIds.includes(userId);
    const nextHelpfulUserIds = alreadyVoted
      ? existing.helpfulUserIds.filter((id) => id !== userId)
      : [...existing.helpfulUserIds, userId];

    const updated = this.reviews.setHelpfulUserIds(reviewId, nextHelpfulUserIds);
    if (!updated) return { success: false, error: "unknown_error" };
    return { success: true, review: this.toReview(updated) };
  }
}
