import { z } from "zod";

export const crewIdSchema = z.string().min(1, "Crew member ID is required");

export const crewFilterParamsSchema = z.object({
  search: z.string().optional(),
  searchby: z.string().optional(),
  page: z.union([z.number(), z.string()]).optional(),
  pagesize: z.union([z.number(), z.string()]).optional(),
  sort: z.string().optional(),
  sortby: z.string().optional(),
}).optional();

export const createCrewMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  photo: z.union([z.any(), z.null()]).optional(),
});

export const updateCrewMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().nullable().or(z.literal("")),
  photo: z.union([z.any(), z.string(), z.null()]).optional(),
});
