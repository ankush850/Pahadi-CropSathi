import { NextResponse, NextRequest } from 'next/server';
import { predictCrop, CropInputFeatures } from '../../../lib/cropRecommender';
import { checkRateLimit } from '../../../lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!(await checkRateLimit(ip))) {
    return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();

    const { N, P, K, temperature, humidity, ph, rainfall } = body;

    if (
      N === undefined ||
      P === undefined ||
      K === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      ph === undefined ||
      rainfall === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required parameters: N, P, K, temperature, humidity, ph, rainfall' },
        { status: 400 }
      );
    }

    const input: CropInputFeatures = {
      N: Number(N),
      P: Number(P),
      K: Number(K),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall)
    };

    const prediction = predictCrop(input);

    return NextResponse.json(prediction, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/recommendation:', error);
    return NextResponse.json({ error: 'Failed to generate crop recommendation' }, { status: 500 });
  }
}
