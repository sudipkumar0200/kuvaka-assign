import { z } from "zod";

export const offerSchema = z.object({
  name: z.string().min(3),
  value_props: z.array(z.string()).min(1),
  ideal_use_cases: z.array(z.string()).min(1),
});
