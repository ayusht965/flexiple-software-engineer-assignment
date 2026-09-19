import { Router } from "express";
import { parseSearchRequirement } from "../services/searchParser";
import { filterProfiles } from "../services/profileFilter";
import { getProfiles } from "../services/profileData";
import { searchSpecSchema } from "../schemas";
import { rankProfiles } from "../services/profileRanker";

const router = Router();

router.post("/parse", async (req, res) => {
  try {
    const { requirement } = req.body;

    if (typeof requirement !== "string") {
      return res.status(400).json({
        error: "requirement must be a string",
      });
    }

    const result = await parseSearchRequirement(requirement);

    return res.json(result);
  } catch (error) {
    console.error("Parse error:", error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to parse search requirement.",
    });
  }
});

router.post("/filter", (req, res) => {
  try {
    const parsed = searchSpecSchema.parse(req.body);

    const profiles = getProfiles();

    const filteredProfiles = filterProfiles(
      profiles,
      parsed.filters
    );

    return res.json({
      count: filteredProfiles.length,
      profiles: filteredProfiles,
    });
  } catch (error) {
    console.error("Filter error:", error);

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Invalid search filters.",
    });
  }
});

router.post("/search", async (req, res) => {
  try {
    const parsed = searchSpecSchema.parse(req.body);

    const profiles = getProfiles();

    // Objective filtering happens locally.
    const filteredProfiles = filterProfiles(
      profiles,
      parsed.filters
    );

    // No need to call the LLM if there are no matches.
    if (filteredProfiles.length === 0) {
      return res.json({
        count: 0,
        profiles: [],
        rankings: [],
      });
    }

    // LLM is only responsible for subjective ranking.
    const rankings = await rankProfiles(
      filteredProfiles,
      parsed.rubric
    );

    return res.json({
      count: filteredProfiles.length,
      profiles: filteredProfiles,
      rankings,
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to execute search.",
    });
  }
});

export default router;