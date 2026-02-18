import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  type: z.enum([
    "birthday",
    "wedding",
    "housewarming",
    "baby_shower",
    "anniversary",
    "custom",
  ]),
  customTypeName: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  eventDate: z.string().optional(),
  coverImage: z.string().url().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const createGiftSchema = z.object({
  name: z.string().min(1, "Gift name is required").max(200),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.coerce
    .number()
    .min(0, "Price must be positive")
    .optional()
    .transform((val) => (val ? Math.round(val * 100) : undefined)), // Convert rupees to paisa
  image: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(500).optional(),
});

export const updateGiftSchema = createGiftSchema.partial();

export const claimGiftSchema = z.object({
  message: z.string().max(500).optional(),
});
