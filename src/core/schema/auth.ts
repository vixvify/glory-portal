import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
});

export const registerUserSchema = userSchema.pick({
  name: true,
  email: true,
  password: true,
}).extend({
  photo: z.instanceof(File).optional(),
  motto: z.string().optional(),
  bio: z.string().optional(),
  ig: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  positions: z.array(z.string()).optional(),
  birthday: z.string().optional(),
  awards: z.array(z.string()).optional(),
});

export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});
