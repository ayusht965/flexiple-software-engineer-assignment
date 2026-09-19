import { refinementSchema } from "../schemas";
import { Filters, Rubric } from "../types";
import { generateJson } from "./gemini";
import { refineSearchPrompt } from "../prompts/refineSearch";

export async function refineSearch(
  filters: Filters,
  rubric: Rubric,
  feedback: string
) {
  const cleanedFeedback = feedback.trim();

  if (!cleanedFeedback) {
    throw new Error("Feedback cannot be empty.");
  }

  if (cleanedFeedback.length > 1000) {
    throw new Error("Feedback is too long.");
  }

  return generateJson(
    refineSearchPrompt(filters, rubric, cleanedFeedback),
    refinementSchema
  );
}