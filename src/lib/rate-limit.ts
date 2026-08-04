/**
 * Minimal fixed-window rate limiter.
 *
 * State lives in the module scope of a single server process, which is enough
 * for this site's one dynamic route (`/api/contact`). On a multi-instance or
 * fully serverless deployment each instance keeps its own counters, so treat
 * this as defence in depth behind a platform/WAF limit rather than a hard cap.
 */

type Window = { count: number; resetAt: number };

export type RateLimitOptions = {
  /** Maximum requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const windows = new Map<string, Window>();

/** Stops the map from growing without bound on a long-lived process. */
const MAX_TRACKED_KEYS = 10_000;

function sweepExpired(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) {
      windows.delete(key);
    }
  }
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      sweepExpired(now);
      if (windows.size >= MAX_TRACKED_KEYS) {
        windows.clear();
      }
    }

    windows.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count >= options.limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: options.limit - existing.count,
    retryAfterSeconds,
  };
}
