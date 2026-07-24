import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { analyzeRegionServer } from '../../../../lib/geminiServer';
import { checkRateLimit } from '../../../../lib/rate-limit';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
  }

  try {
    const { lat, lon, lang, areaData } = await req.json();

    if (lat === undefined || lon === undefined || !lang) {
      return NextResponse.json({ error: 'Missing lat, lon, or lang' }, { status: 400 });
    }

    try {
      const result = await analyzeRegionServer(Number(lat), Number(lon), lang, areaData);
      return NextResponse.json(result, { status: 200 });
    } catch (apiError: any) {
      console.error("Gemini API Error in /api/ai/region:", apiError);
      if (apiError.message?.includes('Rate limit')) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
      return NextResponse.json({ error: 'Failed to analyze region' }, { status: 500 });
    }
  } catch (error) {
    console.error("Failed to parse request in /api/ai/region:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
