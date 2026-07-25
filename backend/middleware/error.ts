import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[SERVER_ERROR] Unhandled exception occurred:`, err.message || err);
  if (err.stack) {
    console.error(err.stack);
  }
  
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred on the telemetry API server.",
  });
}
