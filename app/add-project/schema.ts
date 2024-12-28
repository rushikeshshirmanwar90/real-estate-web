import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  totalBuilding: z.number().min(1, "Must have at least 1 building"),
  images: z
    .array(z.string().url("Must be valid URLs"))
    .min(1, "At least one image is required"),
  state: z.string().min(2, "State must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  area: z.string().min(2, "Area must be at least 2 characters"),
  address: z.string().min(10, "Please enter complete address"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  clientId: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;
