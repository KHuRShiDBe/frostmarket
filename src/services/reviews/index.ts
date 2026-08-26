import { DemoReviewService, type ReviewService } from "./ReviewService";
import { LocalStorageReviewRepository } from "./ReviewRepository";
import { getOrderRepository } from "@/services/orders";

let activeService: ReviewService | null = null;

/**
 * Single point of truth for reviews. Today this resolves to a
 * localStorage-backed demo service (composed with the existing
 * OrderRepository to compute verified purchases); swapping in a real
 * backend later means writing one new `ReviewService` implementation here —
 * no changes needed in the Product Page or Account, which only depend on
 * the interface.
 */
export function getReviewService(): ReviewService {
  if (!activeService) {
    activeService = new DemoReviewService(new LocalStorageReviewRepository(), getOrderRepository());
  }
  return activeService;
}

export type { ReviewService } from "./ReviewService";
export type {
  RatingSummary,
  Review,
  ReviewErrorCode,
  ReviewInput,
  ReviewResult,
  ReviewSortOption,
  ReviewUpdateInput,
  StoredReview,
} from "./types";
