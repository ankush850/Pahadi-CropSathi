import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import { z } from 'zod';
import { sendOtpEmail } from '../../../../lib/mailer';

const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = sendOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Delete existing OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: { email },
    });

    // Save new OTP to database
    await prisma.otpVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send email
    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'OTP sent successfully to your email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error while generating OTP' },
      { status: 500 }
    );
  }
}
