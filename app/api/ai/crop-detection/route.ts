import { NextResponse, NextRequest } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    // Forward image to local Python ML inference server (0 API keys required)
    const localRes = await fetch('http://127.0.0.1:8080/predict-weed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });

    if (!localRes.ok) {
      const err = await localRes.json().catch(() => ({}));
      throw new Error(err.error || 'Local Crop & Weed ML model prediction failed');
    }

    const prediction = await localRes.json();
    return NextResponse.json(prediction, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/ai/crop-detection (Local Model):", error);
    return NextResponse.json({ error: error.message || 'Failed to analyze field crop detection image with local ML model' }, { status: 500 });
  }
}
