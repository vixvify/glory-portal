import { z } from "zod";
import { masterDataSchema } from "./master-data";
import { crewRoleSchema } from "./crew";
import { ContentWarning } from "../domain/movie";

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

export const awardSchema = z.object({
  name: z.string(),
  awardList: z.array(z.string()),
});

export const formAwardSchema = z.object({
  projectName: z.string().transform((str) => str.trim()),
  awardList: z.array(
    z.union([
      z.object({ value: z.string() }).transform((o) => o.value),
      z.string(),
    ])
  ).transform((arr) => arr.map((item) => item.trim()).filter(Boolean)),
});

export const movieSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categories: z.array(masterDataSchema),
  thumbnail: z.unknown(),
  youtubeUrl: z.string().url("Must be a valid URL"),
  trailerUrls: z.array(z.string().url("Must be a valid URL")).optional().nullable(),
  views: z.number().nonnegative().optional(),
  ratings: z.array(ratingSchema).optional(),
  releaseDate: z.union([z.string(), z.date()]),
  matchRate: z.number().min(0).max(100).optional(),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  ageRating: z.string().min(1, "Age rating is required"),
  duration: z.number().min(1, "Duration is required"),
  university: z.string().optional().nullable(),
  school: z.string().optional().nullable(),
  language: z.string().min(1, "Language is required"),
  subtitle: z.string().optional().nullable(),
  contentWarnings: z.array(z.nativeEnum(ContentWarning)).optional(),
  otherContentWarning: z.string().optional().nullable(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
  crew: z.array(movieCrewSchema).optional(),
  btsVideos: z.array(z.string()).optional(),
  awards: z.array(awardSchema).optional(),
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

export const movieCrewInputItemWithRoleSchema = z.object({
  role: z.string(),
  crewMemberId: z.string().uuid().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable().or(z.literal("")),
});

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.array(z.string().uuid()).min(1, "At least one category is required"),
  thumbnail: z.unknown().refine((val) => val !== null, "Thumbnail is required"),
  youtubeUrl: z.string().url("Must be a valid URL"),
  trailerUrls: z.array(z.string().url("Must be a valid URL")).optional().nullable(),
  releaseDate: z.string().min(1, "Release date is required"),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  ageRating: z.string().min(1, "Age rating is required"),
  duration: z.number().min(1, "Duration is required"),
  university: z.string().optional().nullable().or(z.literal("")),
  school: z.string().optional().nullable().or(z.literal("")),
  language: z.string().min(1, "Language is required"),
  subtitle: z.string().optional().nullable().or(z.literal("")),
  crew: z.array(movieCrewInputItemWithRoleSchema).refine((crew) => crew.some((c) => c.name && c.name.trim() !== ""), "กรุณาเพิ่มทีมงานอย่างน้อย 1 คน"),
  btsVideo: z.array(z.string()).optional().nullable(),
  contentWarnings: z.array(z.union([z.nativeEnum(ContentWarning), z.literal("OTHER")])).optional().nullable(),
  otherContentWarning: z.string().optional().nullable(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
  awards: z.array(formAwardSchema).transform((arr) => arr.filter((a) => a.projectName !== "")).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
}).superRefine((data, ctx) => {
  if ((data.contentWarnings as string[] | undefined)?.includes("OTHER")) {
    if (!data.otherContentWarning || data.otherContentWarning.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุคำเตือนเนื้อหาอื่นๆ",
        path: ["otherContentWarning"],
      });
    }
  }
});

export const updateMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.array(z.string().uuid()).min(1, "At least one category is required"),
  thumbnail: z
    .unknown()
    .refine(
      (val) => val !== null && val !== undefined,
      "Thumbnail is required",
    ),
  youtubeUrl: z.string().url("Must be a valid URL"),
  trailerUrls: z.array(z.string().url("Must be a valid URL")).optional().nullable(),
  releaseDate: z.string().min(1, "Release date is required"),
  aspectRatio: z.string().min(1, "Aspect ratio is required"),
  ageRating: z.string().min(1, "Age rating is required"),
  duration: z.number().min(1, "Duration is required"),
  university: z.string().optional().nullable().or(z.literal("")),
  school: z.string().optional().nullable().or(z.literal("")),
  language: z.string().min(1, "Language is required"),
  subtitle: z.string().optional().nullable().or(z.literal("")),
  crew: z.array(movieCrewInputItemWithRoleSchema).refine((crew) => crew.some((c) => c.name && c.name.trim() !== ""), "กรุณาเพิ่มทีมงานอย่างน้อย 1 คน"),
  btsVideo: z.array(z.string()).optional().nullable(),
  contentWarnings: z.array(z.union([z.nativeEnum(ContentWarning), z.literal("OTHER")])).optional().nullable(),
  otherContentWarning: z.string().optional().nullable(),
  colorType: z.string().min(1, "Color type is required"),
  studio: z.string().optional().nullable(),
  awards: z.array(formAwardSchema).transform((arr) => arr.filter((a) => a.projectName !== "")).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
}).superRefine((data, ctx) => {
  if ((data.contentWarnings as string[] | undefined)?.includes("OTHER")) {
    if (!data.otherContentWarning || data.otherContentWarning.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุคำเตือนเนื้อหาอื่นๆ",
        path: ["otherContentWarning"],
      });
    }
  }
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
