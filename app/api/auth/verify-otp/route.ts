import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = verifyOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, otp } = validation.data;

    // Find OTP record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { email, otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otpVerification.delete({ where: { id: otpRecord.id } });
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // OTP is valid - delete verified OTP record
    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    return NextResponse.json(
      { verified: true, message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error while verifying OTP' },
      { status: 500 }
    );
  }
}
