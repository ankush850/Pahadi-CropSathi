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
    const existing = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existing.userId && existing.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.communityPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  const { id: postId } = await params;

  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (user) {
      // Check if user already liked the post
      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: user.id
          }
        }
      });

      if (existingLike) {
        // Toggle UNLIKE (Remove 1 like)
        await prisma.postLike.delete({
          where: { id: existingLike.id }
        });

        const updatedPost = await prisma.communityPost.update({
          where: { id: postId },
          data: { likes: Math.max(0, post.likes - 1) }
        });

        return NextResponse.json({ likes: updatedPost.likes, isLiked: false }, { status: 200 });
      } else {
        // Toggle LIKE (Add 1 like per user)
        await prisma.postLike.create({
          data: {
            postId,
            userId: user.id
          }
        });

        const updatedPost = await prisma.communityPost.update({
          where: { id: postId },
          data: { likes: post.likes + 1 }
        });

        return NextResponse.json({ likes: updatedPost.likes, isLiked: true }, { status: 200 });
      }
    } else {
      // Unauthenticated guest user fallback increment
      const updatedPost = await prisma.communityPost.update({
        where: { id: postId },
        data: { likes: post.likes + 1 }
      });

      return NextResponse.json({ likes: updatedPost.likes, isLiked: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Failed to process like:", error);
    return NextResponse.json({ error: "Failed to update like status" }, { status: 500 });
  }
}
