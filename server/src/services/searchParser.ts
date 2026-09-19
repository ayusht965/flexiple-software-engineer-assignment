import { searchSpecSchema } from "../schemas";
import { generateJson } from "./gemini";
import { parseSearchPrompt } from "../prompts/parseSearch";

export async function parseSearchRequirement(requirement: string) {
  const cleanedRequirement = requirement.trim();

  if (!cleanedRequirement) {
    throw new Error("Search requirement cannot be empty.");
  }

  if (cleanedRequirement.length > 1000) {
    throw new Error("Search requirement is too long.");
  }

  return generateJson(
    parseSearchPrompt(cleanedRequirement),
    searchSpecSchema
  );
}