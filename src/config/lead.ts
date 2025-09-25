import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  industry: z.string().min(1),
  location: z.string().min(1),
  linkedin_bio: z.string().min(1),
});
