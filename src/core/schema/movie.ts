import { z } from "zod";

export const ratingSchema = z
  .object({
    movieId: z.string(),
    userId: z.string(),
    stars: z.number().min(1).max(5),
    comment: z.string().optional().nullable(),
    createdAt: z.union([z.string(), z.date()]).optional(),
    updatedAt: z.union([z.string(), z.date()]).optional(),
    user: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      })
      .partial()
      .optional(),
  })
  .partial();

export const masterDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.union([z.string(), z.date()]).optional(),
});

export const crewRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.union([z.string(), z.date()]).optional(),
});

export const movieCrewSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  crewMemberId: z.string(),
  roleId: z.string(),
  role: z.string(),
  crewRole: crewRoleSchema.optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export const movieSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: masterDataSchema,
  thumbnail: z.unknown(),
  youtubeUrl: z.string().url("Must be a valid URL"),
  trailerUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  views: z.number().nonnegative().optional(),
  ratings: z.array(ratingSchema).optional(),
  year: z.number().int().min(1900).max(2100),
  matchRate: z.number().min(0).max(100).optional(),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  ageRating: masterDataSchema,
  duration: z.number().min(1, "Duration is required"),
  university: masterDataSchema.optional().nullable(),
  language: masterDataSchema.optional().nullable(),
  targetGroup: masterDataSchema.optional().nullable(),
  hasProfanity: z.boolean().optional(),
  hasDrugs: z.boolean().optional(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
  crew: z.array(movieCrewSchema).optional(),
  btsVideos: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  creator: z.unknown().optional().nullable(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export const movieCrewInputItemSchema = z.object({
  crewMemberId: z.string().uuid().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable().or(z.literal("")),
});

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().uuid("Category is required"),
  thumbnail: z.unknown().refine((val) => val !== null, "Thumbnail is required"),
  youtubeUrl: z.string().url("Must be a valid URL"),
  trailerUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  year: z.number().int().min(1900).max(2100),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  ageRatingId: z.string().uuid("Age rating is required"),
  duration: z.number().min(1, "Duration is required"),
  universityId: z.string().uuid().optional().nullable().or(z.literal("")),
  languageId: z.string().uuid().optional().nullable().or(z.literal("")),
  targetGroupId: z.string().uuid().optional().nullable().or(z.literal("")),
  director: z.array(movieCrewInputItemSchema).optional().nullable(),
  producer: z.array(movieCrewInputItemSchema).optional().nullable(),
  writer: z.array(movieCrewInputItemSchema).optional().nullable(),
  cast: z.array(movieCrewInputItemSchema).optional().nullable(),
  dop: z.array(movieCrewInputItemSchema).optional().nullable(),
  editor: z.array(movieCrewInputItemSchema).optional().nullable(),
  btsVideo: z.array(z.string()).optional().nullable(),
  hasProfanity: z.boolean().optional(),
  hasDrugs: z.boolean().optional(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
});

export const updateMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().uuid("Category is required"),
  thumbnail: z
    .unknown()
    .refine(
      (val) => val !== null && val !== undefined,
      "Thumbnail is required",
    ),
  youtubeUrl: z.string().url("Must be a valid URL"),
  trailerUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
    .nullable(),
  year: z.number().int().min(1900).max(2100),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  ageRatingId: z.string().uuid("Age rating is required"),
  duration: z.number().min(1, "Duration is required"),
  universityId: z.string().uuid().optional().nullable().or(z.literal("")),
  languageId: z.string().uuid().optional().nullable().or(z.literal("")),
  targetGroupId: z.string().uuid().optional().nullable().or(z.literal("")),
  director: z.array(movieCrewInputItemSchema).optional().nullable(),
  producer: z.array(movieCrewInputItemSchema).optional().nullable(),
  writer: z.array(movieCrewInputItemSchema).optional().nullable(),
  cast: z.array(movieCrewInputItemSchema).optional().nullable(),
  dop: z.array(movieCrewInputItemSchema).optional().nullable(),
  editor: z.array(movieCrewInputItemSchema).optional().nullable(),
  btsVideo: z.array(z.string()).optional().nullable(),
  hasProfanity: z.boolean().optional(),
  hasDrugs: z.boolean().optional(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
});

export const movieIdSchema = z.string().min(1, "Movie ID is required");

export const movieFilterParamsSchema = z
  .object({
    search: z.string().optional(),
    searchby: z.string().optional(),
    page: z.union([z.number(), z.string()]).optional(),
    pagesize: z.union([z.number(), z.string()]).optional(),
    sort: z.string().optional(),
    sortby: z.string().optional(),
  })
  .optional();
