/**
 * What actually gets persisted. `verifiedPurchase` is deliberately absent —
 * it's never stored, only computed on read from the existing Orders system
 * (see ReviewService), so it can never go stale or be spoofed.
 */
export interface StoredReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  /** Ids of users who have marked this review helpful; toggled, never incremented directly. */
  helpfulUserIds: string[];
  /** True for the small bundled demo dataset, never for a real user's review. */
  isSeed: boolean;
}

/** Public-facing review shape used by the UI. */
export interface Review extends StoredReview {
  /** Derived count, kept in sync with `helpfulUserIds.length`. */
  helpfulCount: number;
  /** Computed from the reviewer's real Orders — true only if they actually bought this product. */
  verifiedPurchase: boolean;
}

export interface ReviewInput {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  text: string;
}

export interface ReviewUpdateInput {
  rating: number;
  title?: string;
  text: string;
}

/**
 * Error codes only — never a display string, matching AuthResult's approach.
 * The UI (which already owns KO/RU/EN copy) decides how each code reads.
 */
export type ReviewErrorCode =
  | "not_authenticated"
  | "already_reviewed"
  | "invalid_rating"
  | "text_required"
  | "not_found"
  | "forbidden"
  | "unknown_error";

export type ReviewResult = { success: true; review: Review } | { success: false; error: ReviewErrorCode };

export type ReviewSortOption = "newest" | "oldest" | "highest" | "lowest" | "helpful";

export interface RatingSummary {
  /** 0 when there are no reviews yet. */
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
