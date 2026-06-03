import { z } from "zod";

export const ratingSchema = z.object({
  user: z.string(),
  score: z.number().min(1).max(5),
});

export const categorySchema = z.enum([
  "Action",
  "Sci-Fi",
  "Horror",
  "Comedy",
  "Thriller",
  "Drama",
  "Romance",
  "Adventure",
  "Fantasy",
  "Animation",
  "Biography",
  "Documentary",
  "Family",
  "Music",
  "Mystery",
  "Sport",
  "Western",
]);
export const ageRatingSchema = z.enum(["G", "PG", "PG-13", "NC-17", "R"]);

export const movieSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: categorySchema,
  thumbnail: z.unknown(),
  youtubeUrl: z.string().url("Must be a valid URL"),
  views: z.number().nonnegative().optional(),
  ratings: z.any().optional(),
  year: z.number().int().min(1900).max(2100),
  matchRate: z.number().min(0).max(100),
  ageRating: ageRatingSchema,
  duration: z.number().min(1, "Duration is required"),
  university: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  targetGroup: z.string().optional().nullable(),
  hasProfanity: z.boolean().optional(),
  hasDrugs: z.boolean().optional(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
  director: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  producer: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  writer: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  cast: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  dop: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  editor: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .nullable(),
  btsVideo: z.string().optional().nullable(),
});

export const updateMovieSchema = movieSchema.omit({
  id: true,
  views: true,
  ratings: true,
});

export const createMovieSchema = movieSchema.omit({
  id: true,
  views: true,
  ratings: true,
});

export const movieIdSchema = z.string().min(1, "Movie ID is required");

export const movieFilterParamsSchema = z.object({
  search: z.string().optional(),
  searchby: z.string().optional(),
  page: z.union([z.number(), z.string()]).optional(),
  pagesize: z.union([z.number(), z.string()]).optional(),
  sort: z.string().optional(),
  sortby: z.string().optional(),
}).optional();

