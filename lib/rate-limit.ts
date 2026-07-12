export const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

const RATE_LIMIT = 5; // 5 requests
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // If no record or record expired
  if (!record || record.expiresAt < now) {
    rateLimitStore.set(ip, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });
    return true; // Allowed
  }

  // Record exists and not expired
  if (record.count >= RATE_LIMIT) {
    return false; // Denied
  }

  // Increment count
  record.count += 1;
  return true; // Allowed
}
