import { z } from "zod";

export const rsvpSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(200)
    .optional()
    .or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  status: z.enum(["ATTENDING", "NOT_ATTENDING"]),
  guestCount: z.coerce.number().int().min(1).max(10),
  dietaryNotes: z.string().trim().max(300).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export const memoryCreateSchema = z.object({
  authorName: z.string().trim().min(2, "Please share your name.").max(120),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(["PHOTO", "VIDEO"]).optional(),
});

export type MemoryCreateInput = z.infer<typeof memoryCreateSchema>;

export const memoryUpdateSchema = z.object({
  authorName: z.string().trim().min(2).max(120).optional(),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  editToken: z.string().min(10),
});

export type MemoryUpdateInput = z.infer<typeof memoryUpdateSchema>;
