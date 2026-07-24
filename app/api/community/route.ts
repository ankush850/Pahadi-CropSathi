import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

const initialSeedPosts = [
  {
    author: 'Rajesh Kumar',
    location: 'Himachal Pradesh',
    title: 'Best practices for apple orchard management in hill regions',
    content: 'After 15 years of apple farming in Shimla district, I wanted to share key pruning and soil nourishment techniques that have significantly boosted my yield quality...',
    category: 'Crop Management',
    tags: JSON.stringify(['apples', 'orchard', 'yield', 'pahadi']),
    likes: 24,
    comments: 8,
    isExpert: false,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
  },
  {
    author: 'Dr. Priya Sharma',
    location: 'Uttarakhand',
    title: 'Organic pest control methods for hill crops',
    content: 'As an agricultural scientist specializing in mountain agriculture, I have tested various eco-friendly pest control methods for terrace farming...',
    category: 'Pest Control',
    tags: JSON.stringify(['organic', 'pest-control', 'terrace-farming']),
    likes: 42,
    comments: 15,
    isExpert: true
  },
  {
    author: 'Amit Patel',
    location: 'Jammu & Kashmir',
    title: 'Drip irrigation setups for hillside saffron & spice plots',
    content: 'Implementing micro-drip irrigation on sloped terrain reduced water runoff by 40% while preserving soil nutrients...',
    category: 'Water Management',
    tags: JSON.stringify(['water-conservation', 'irrigation', 'saffron']),
    likes: 36,
    comments: 12,
    isExpert: false
  }
];

export async function GET(req: NextRequest) {
  try {
    let posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Seed if empty
    if (posts.length === 0) {
      await prisma.communityPost.createMany({
        data: initialSeedPosts,
      });
      posts = await prisma.communityPost.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    const formattedPosts = posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
      date: post.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("Failed to fetch community posts:", error);
    return NextResponse.json({ error: "Failed to fetch community posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = await prisma.communityPost.create({
      data: {
        userId: user.id,
        author: data.author || user.email?.split('@')[0] || 'Farmer',
        location: data.location || 'Local Region',
        title: data.title,
        content: data.content,
        category: data.category || 'General',
        tags: JSON.stringify(data.tags || []),
        isExpert: false,
        image: data.image || null,
      },
    });

    return NextResponse.json({
      ...newPost,
      tags: JSON.parse(newPost.tags || '[]'),
      date: newPost.createdAt.toISOString().split('T')[0]
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
