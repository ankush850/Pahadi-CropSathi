import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' }
    });

    const formattedComments = comments.map(c => ({
      ...c,
      date: c.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json(formattedComments, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  const { id: postId } = await params;

  try {
    const body = await req.json();
    if (!body.content || !body.content.trim()) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const authorName = user?.name || user?.email?.split('@')[0] || body.author || 'Farmer';

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: user?.id || null,
        author: authorName,
        content: body.content.trim()
      }
    });

    // Increment comments counter on post
    await prisma.communityPost.update({
      where: { id: postId },
      data: { comments: post.comments + 1 }
    });

    return NextResponse.json({
      ...comment,
      date: comment.createdAt.toISOString().split('T')[0]
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
