import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { config, validateEnv } from "./backend/config/env";
import { requestLogger } from "./backend/middleware/logging";
import { errorHandler } from "./backend/middleware/error";
import openf1Routes from "./backend/routes/openf1Routes";
import geminiRoutes from "./backend/routes/geminiRoutes";
import { warmCache } from "./backend/controllers/openf1Controller";

async function startServer() {
  validateEnv();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Telemetry & Access logging middleware
  app.use(requestLogger);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Mount modular sub-routes
  app.use("/api/openf1", openf1Routes);
  app.use("/api/gemini", geminiRoutes);

  // Vite middleware for development or static file server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: path.join(process.cwd(), "vite.config.ts"),
      root: path.join(process.cwd(), "frontend"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.join(process.cwd(), "dist"))
      ? path.join(process.cwd(), "dist")
      : path.join(process.cwd(), "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Centralized error middleware handling
  app.use(errorHandler);

  // Warm OpenF1 meetings metadata cache after startup
  setTimeout(warmCache, 5000);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[APEX CTRL SERVER] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
