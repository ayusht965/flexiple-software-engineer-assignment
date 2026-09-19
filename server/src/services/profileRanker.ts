import { rankingSchema } from "../schemas";
import { Profile, Rubric } from "../types";
import { generateJson } from "./gemini";
import { rankProfilesPrompt } from "../prompts/rankProfiles";

export async function rankProfiles(
  profiles: Profile[],
  rubric: Rubric
) {
  if (profiles.length === 0) {
    return [];
  }

  const result = await generateJson(
    rankProfilesPrompt(rubric, profiles),
    rankingSchema
  );

  const allowedIds = new Set(profiles.map((profile) => profile.id));

  const seenIds = new Set<string>();

  const validRankings = result.rankings.filter((ranking) => {
    if (!allowedIds.has(ranking.profile_id)) {
      return false;
    }

    if (seenIds.has(ranking.profile_id)) {
      return false;
    }

    seenIds.add(ranking.profile_id);

    return true;
  });

  return validRankings
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}