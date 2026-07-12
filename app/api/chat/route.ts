import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const chats = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' }, // Ascending for chat history
    });
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const chat = await prisma.chatMessage.create({
      data: {
        role: data.role,
        text: data.text,
      },
    });

    return NextResponse.json(chat, { status: 201 });
  } catch (error) {
    console.error("Failed to save chat message:", error);
    return NextResponse.json({ error: "Failed to save chat message" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.chatMessage.deleteMany({});
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to clear chat history:", error);
    return NextResponse.json({ error: "Failed to clear chat history" }, { status: 500 });
  }
}
