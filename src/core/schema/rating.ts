import { z } from "zod";

export const createRatingSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  stars: z.number().min(1).max(5),
});

export const updateRatingSchema = createRatingSchema;

export const ratingParamsSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
});
