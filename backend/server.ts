import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import { config, validateEnv } from "./config/env";
import { requestLogger } from "./middleware/logging";
import { errorHandler } from "./middleware/error";
import openf1Routes from "./routes/openf1Routes";
import geminiRoutes from "./routes/geminiRoutes";
import { warmCache } from "./controllers/openf1Controller";

const app = express();

app.use(cors());
app.use(express.json());

// Telemetry & Access logging middleware
app.use(requestLogger);

// Health check endpoint (AWS ECS and Vercel health monitoring compliance)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Mount modular sub-routes
app.use("/api/openf1", openf1Routes);
app.use("/api/gemini", geminiRoutes);

// Serve fallback static index.html or status message
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send("APEX CTRL Backend API Server Active");
    }
  });
});

// Centralized error middleware handling
app.use(errorHandler);

let server: http.Server;

async function startServer() {
  // المركزي environment configurations check
  validateEnv();
  
  // Warm OpenF1 meetings metadata cache after startup
  setTimeout(warmCache, 5000);

  server = app.listen(config.PORT, "0.0.0.0", () => {
   console.log(`[APEX CTRL SERVER] Listening on http://0.0.0.0:${config.PORT}`);
  });

  // Graceful shutdown handling for container instances (AWS ECS SIGTERM compliance)
  const gracefulShutdown = (signal: string) => {
    console.log(`[Server] Received ${signal}. Initiating safe graceful shutdown lifecycle...`);
    if (server) {
      server.close(() => {
        console.log("[Server] Active HTTP server terminated. Process exiting safely.");
        process.exit(0);
      });
      // Force exit fallback if connections are held open too long
      setTimeout(() => {
        console.warn("[Server] Forced shutdown triggered due to persistent active client connections.");
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
