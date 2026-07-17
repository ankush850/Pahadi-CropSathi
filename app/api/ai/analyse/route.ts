import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { analyseImage } from '../../../../lib/geminiServer';

export const maxDuration = 60; // Set max duration for API route to allow Gemini to finish (on Vercel)

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { image, lang } = await req.json();

    if (!image || !lang) {
      return NextResponse.json({ error: 'Missing image or lang' }, { status: 400 });
    }

    try {
      const result = await analyseImage(image, lang);
      return NextResponse.json(result, { status: 200 });
    } catch (apiError: any) {
      console.error("Gemini API Error in /api/ai/analyse:", apiError);
      if (apiError.message?.includes('Rate limit')) {
         return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
      if (apiError.name === 'AbortError' || apiError.message?.includes('timeout')) {
         return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
      }
      return NextResponse.json({ error: 'Failed to analyze image with AI' }, { status: 500 });
    }

  } catch (error) {
    console.error("Failed to parse request in /api/ai/analyse:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
