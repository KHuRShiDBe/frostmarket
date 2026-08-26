import type { StoredReview } from "./types";
import { SEED_REVIEWS } from "./seedReviews";

/**
 * Storage seam for reviews. The UI/ReviewService never touch localStorage
 * directly — swapping in a real backend later means writing one new
 * implementation of this interface.
 */
export interface ReviewRepository {
  getAll(): StoredReview[];
  getByProductId(productId: string): StoredReview[];
  getByUserId(userId: string): StoredReview[];
  getByProductAndUser(productId: string, userId: string): StoredReview | null;
  getById(id: string): StoredReview | null;
  create(review: StoredReview): void;
  update(
    id: string,
    updates: Partial<Pick<StoredReview, "rating" | "title" | "text" | "updatedAt">>,
  ): StoredReview | null;
  delete(id: string): boolean;
  setHelpfulUserIds(id: string, helpfulUserIds: string[]): StoredReview | null;
}

const REVIEWS_KEY = "frostmarket:reviews";

function writeReviews(reviews: StoredReview[]): void {
  try {
    window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function readReviews(): StoredReview[] {
  try {
    const raw = window.localStorage.getItem(REVIEWS_KEY);
    // Key has never been written: this is a first run, so seed the small
    // demo dataset once. An empty array (all reviews since deleted) is left
    // alone — seeds never come back just because the user cleared them.
    if (raw === null) {
      writeReviews(SEED_REVIEWS);
      return SEED_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Demo-only implementation backed by localStorage. Replace with a real API-backed repository later. */
export class LocalStorageReviewRepository implements ReviewRepository {
  getAll(): StoredReview[] {
    return readReviews();
  }

  getByProductId(productId: string): StoredReview[] {
    return readReviews().filter((review) => review.productId === productId);
  }

  getByUserId(userId: string): StoredReview[] {
    return readReviews().filter((review) => review.userId === userId);
  }

  getByProductAndUser(productId: string, userId: string): StoredReview | null {
    return (
      readReviews().find((review) => review.productId === productId && review.userId === userId) ?? null
    );
  }

  getById(id: string): StoredReview | null {
    return readReviews().find((review) => review.id === id) ?? null;
  }

  create(review: StoredReview): void {
    const reviews = readReviews();
    reviews.push(review);
    writeReviews(reviews);
  }

  update(
    id: string,
    updates: Partial<Pick<StoredReview, "rating" | "title" | "text" | "updatedAt">>,
  ): StoredReview | null {
    const reviews = readReviews();
    const index = reviews.findIndex((review) => review.id === id);
    if (index === -1) return null;

    const updated = { ...reviews[index], ...updates };
    reviews[index] = updated;
    writeReviews(reviews);
    return updated;
  }

  delete(id: string): boolean {
    const reviews = readReviews();
    const next = reviews.filter((review) => review.id !== id);
    if (next.length === reviews.length) return false;
    writeReviews(next);
    return true;
  }

  setHelpfulUserIds(id: string, helpfulUserIds: string[]): StoredReview | null {
    const reviews = readReviews();
    const index = reviews.findIndex((review) => review.id === id);
    if (index === -1) return null;

    const updated = { ...reviews[index], helpfulUserIds };
    reviews[index] = updated;
    writeReviews(reviews);
    return updated;
  }
}
