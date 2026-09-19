import { Router } from "express";
import { parseSearchRequirement } from "../services/searchParser";

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

export default router;