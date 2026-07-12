import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
    
    // Optionally check if user still exists in the DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
