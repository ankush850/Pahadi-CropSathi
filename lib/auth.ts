import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyToken(req: NextRequest) {
  // 1. Check for NextAuth session (cookies)
  try {
    const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (nextAuthToken && nextAuthToken.sub) {
      return { id: nextAuthToken.sub, email: nextAuthToken.email };
    }
  } catch (error) {
    // Ignore and fallback to custom JWT
  }

  // 2. Check for Custom JWT (Authorization header)
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Check if user still exists in the DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true } // Exclude password
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Alias for readability
export const requireAuth = verifyToken;
