import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { summariseFeature } from '../../../../lib/geminiServer';
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
    const { featureId, context, lang } = await req.json();

    if (!featureId || !lang) {
      return NextResponse.json({ error: 'Missing featureId or lang' }, { status: 400 });
    }

    try {
      const result = await summariseFeature(featureId, context || {}, lang);
      return NextResponse.json(result, { status: 200 });
    } catch (apiError: any) {
      console.error("Gemini API Error in /api/ai/summarise:", apiError);
      if (apiError.message?.includes('Rate limit')) {
         return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
      if (apiError.name === 'AbortError' || apiError.message?.includes('timeout')) {
         return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
      }
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }

  } catch (error) {
    console.error("Failed to parse request in /api/ai/summarise:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
