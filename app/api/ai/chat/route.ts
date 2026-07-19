import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { chatResponse } from '../../../../lib/geminiServer';
import { checkRateLimit } from '../../../../lib/rate-limit';
import { z } from 'zod';

const chatSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })),
  message: z.string().min(1),
  lang: z.string().min(2),
  context: z.any().optional()
});

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
    const body = await req.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request payload format' }, { status: 400 });
    }

    const { history, message, lang, context } = parsed.data;

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
