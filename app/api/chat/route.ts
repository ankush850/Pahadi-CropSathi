import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
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

export async function POST(req: Request) {
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

export async function DELETE() {
  try {
    await prisma.chatMessage.deleteMany({});
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to clear chat history:", error);
    return NextResponse.json({ error: "Failed to clear chat history" }, { status: 500 });
  }
}
