import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { chatResponse } from '../../../../lib/geminiServer';

export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { history, message, lang, context } = await req.json();

    if (!message || !lang || !history) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
      const result = await chatResponse(history, message, lang, context);
      return NextResponse.json({ reply: result }, { status: 200 });
    } catch (apiError: any) {
      console.error("Gemini API Error in /api/ai/chat:", apiError);
      if (apiError.message?.includes('Rate limit')) {
         return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
      if (apiError.name === 'AbortError' || apiError.message?.includes('timeout')) {
         return NextResponse.json({ error: 'Request timed out' }, { status: 408 });
      }
      return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
    }

  } catch (error) {
    console.error("Failed to parse request in /api/ai/chat:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
