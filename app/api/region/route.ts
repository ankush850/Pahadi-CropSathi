import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const regions = await prisma.regionAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(regions);
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const region = await prisma.regionAnalysis.create({
      data: {
        soilPotential: data.soilPotential,
        climateSuitability: data.climateSuitability,
        waterSources: data.waterSources,
        overallRating: data.overallRating,
        areaSize: data.areaSize || null,
        coordinates: data.coordinates || null,
      },
    });

    return NextResponse.json(region, { status: 201 });
  } catch (error) {
    console.error("Failed to save region:", error);
    return NextResponse.json({ error: "Failed to save region" }, { status: 500 });
  }
}
