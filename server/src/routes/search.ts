import { Router } from "express";
import { parseSearchRequirement } from "../services/searchParser";
import { filterProfiles } from "../services/profileFilter";
import { getProfiles } from "../services/profileData";
import { searchSpecSchema } from "../schemas";

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

export default router;