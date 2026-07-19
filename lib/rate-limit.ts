import prisma from './prisma';

const RATE_LIMIT = 5; // 5 requests
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function checkRateLimit(ip: string): Promise<boolean> {
  const now = new Date();
  
  try {
    const record = await prisma.rateLimit.findUnique({
      where: { ip }
    });

    // If no record or record expired
    if (!record || record.expiresAt < now) {
      await prisma.rateLimit.upsert({
        where: { ip },
        update: {
          count: 1,
          expiresAt: new Date(Date.now() + WINDOW_MS)
        },
        create: {
          ip,
          count: 1,
          expiresAt: new Date(Date.now() + WINDOW_MS)
        }
      });
      return true; // Allowed
    }

    // Record exists and not expired
    if (record.count >= RATE_LIMIT) {
      return false; // Denied
    }

    // Increment count
    await prisma.rateLimit.update({
      where: { ip },
      data: { count: record.count + 1 }
    });
    return true; // Allowed
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open in case of DB error to not block legitimate users
    return true; 
  }
}
