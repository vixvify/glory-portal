import { z } from "zod";

export const masterDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  labelTh: z.string().optional().nullable(),
  createdAt: z.union([z.string(), z.date()]).optional(),
});
