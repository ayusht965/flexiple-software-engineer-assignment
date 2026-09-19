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

export const rankingSchema = z.object({
  rankings: z
    .array(
      z.object({
        profile_id: z.string().min(1),
        score: z.number().min(0).max(100),
        explanation: z.string().min(1).max(600),
        strengths: z.array(z.string()).max(6),
        concerns: z.array(z.string()).max(4),
      })
    )
    .max(48),
});

export const searchSpecSchema = z.object({
  filters: filtersSchema,
  rubric: rubricSchema,
});

export const refinementSchema = z.object({
  filters: filtersSchema,
  rubric: rubricSchema,
  changes: z
    .array(
      z.object({
        area: z.enum(["filters", "rubric"]),
        change: z.string().min(1).max(300),
        reason: z.string().min(1).max(500),
      })
    )
    .min(1)
    .max(8),
});

export type SearchSpec = z.infer<typeof searchSpecSchema>;