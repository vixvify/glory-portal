import { Rating } from "@/core/domain/rating";

export interface RatingStats {
  averageRating: number;
  ratingCount: number;
}

export function calculateRatingStats(ratings?: Rating[] | null): RatingStats {
  if (!ratings || ratings.length === 0) {
    return { averageRating: 0, ratingCount: 0 };
  }
  const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
  const avg = sum / ratings.length;
  return {
    averageRating: parseFloat(avg.toFixed(1)),
    ratingCount: ratings.length,
  };
}
