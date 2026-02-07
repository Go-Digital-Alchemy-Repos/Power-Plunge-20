import type { Request, Response, NextFunction } from "express";

const SLOW_THRESHOLD_MS = 200;

export function serverTimingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (process.env.NODE_ENV === "production") {
    next();
    return;
  }

  if (!req.path.startsWith("/api")) {
    next();
    return;
  }

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationMs = Math.round(durationNs / 1e6);

    if (durationMs >= SLOW_THRESHOLD_MS) {
      console.warn(
        `[SLOW-ENDPOINT] ${req.method} ${req.path} took ${durationMs}ms (threshold: ${SLOW_THRESHOLD_MS}ms)`
      );
    }
  });

  next();
}
