import { z } from "zod";

const companyTypeSchema = z.enum([
  "startup",
  "scaleup",
  "enterprise",
  "agency",
]);

export const filtersSchema = z.object({
  skills: z.array(z.string()).max(15),
  years_experience: z.object({
    min: z.number().min(0).max(50).nullable(),
    max: z.number().min(0).max(50).nullable(),
  }),
  locations: z.array(z.string()).max(10),
  company_types: z.array(companyTypeSchema).max(4),
});

export const rubricCriterionSchema = z.object({
  name: z.string().min(1).max(100),
  importance: z.enum(["high", "medium", "low"]),
  description: z.string().min(1).max(500),
});

export const rubricSchema = z.object({
  summary: z.string().min(1).max(1000),
  criteria: z.array(rubricCriterionSchema).min(1).max(8),
});

export const searchSpecSchema = z.object({
  filters: filtersSchema,
  rubric: rubricSchema,
});

export type SearchSpec = z.infer<typeof searchSpecSchema>;