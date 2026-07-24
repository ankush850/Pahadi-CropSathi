import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyToken } from '../../../../lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.plantAnalysis.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Analysis record not found' }, { status: 404 });
    }

    if (existing.userId && existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.plantAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete analysis:", error);
    return NextResponse.json({ error: "Failed to delete analysis" }, { status: 500 });
  }
}
