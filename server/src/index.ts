import "dotenv/config";

import express from "express";
import cors from "cors";
import searchRouter from "./routes/search";

const app = express();

const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api", searchRouter);

// Error handler MUST have 4 parameters.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled server error:", err);

    res.status(500).json({
      error: "Internal server error",
    });
  }
);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});