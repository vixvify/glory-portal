import { z } from "zod";

export const ratingInputSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  userId: z.string().min(1, "User ID is required"),
  stars: z.number().min(1).max(5),
});

export const ratingCheckInputSchema = z.object({
  movieId: z.string().min(1, "Movie ID is required"),
  userId: z.string().min(1, "User ID is required"),
});
