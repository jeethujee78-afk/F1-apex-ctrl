import { Request, Response, NextFunction } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[API_REQUEST] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms - IP: ${req.ip}`);
  });
  
  next();
}

export function logServerMetrics(metrics: {
  endpoint: string;
  responseTimeMs: number;
  cacheHit: boolean;
  cacheMiss: boolean;
  retryCount: number;
  rateLimitDetected: boolean;
  error: string | null;
}) {
  console.log(`[SERVER_TELEMETRY_LOG]`, JSON.stringify(metrics));
}
