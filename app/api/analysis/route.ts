import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const analyses = await prisma.plantAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Parse JSON strings back to objects
    const formattedAnalyses = analyses.map(a => ({
      ...a,
      treatments: JSON.parse(a.treatments),
      detectedPests: a.detectedPests ? JSON.parse(a.detectedPests) : undefined,
      recommendedCrops: JSON.parse(a.recommendedCrops),
    }));

    return NextResponse.json(formattedAnalyses);
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const analysis = await prisma.plantAnalysis.create({
      data: {
        plantName: data.plantName,
        diseaseName: data.diseaseName,
        confidence: data.confidence,
        severity: data.severity,
        treatments: JSON.stringify(data.treatments || []),
        isHealthy: data.isHealthy,
        pestsDetected: data.pestsDetected || false,
        pestDetails: data.pestDetails || null,
        detectedPests: data.detectedPests ? JSON.stringify(data.detectedPests) : null,
        nutrientDeficiency: data.nutrientDeficiency || false,
        deficiencyDetails: data.deficiencyDetails || null,
        weedDetected: data.weedDetected || false,
        yieldPrediction: data.yieldPrediction || null,
        soilTypeRecommendation: data.soilTypeRecommendation,
        soilExplanation: data.soilExplanation,
        recommendedCrops: JSON.stringify(data.recommendedCrops || []),
      },
    });

    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error("Failed to save analysis:", error);
    return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 });
  }
}
