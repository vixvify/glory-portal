import { Rating } from "@/core/domain/rating";

export interface RatingStats {
  ratingCount: number;
}

export function calculateRatingStats(ratings?: Rating[] | null): RatingStats {
  if (!ratings || ratings.length === 0) {
    return { ratingCount: 0 };
  }
  return {
    ratingCount: ratings.length,
  };
}
