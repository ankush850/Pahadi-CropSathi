import nodemailer from 'nodemailer';

export async function sendOtpEmail(toEmail: string, otp: string): Promise<boolean> {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Fallback for development if SMTP credentials are not yet added to .env
  if (!user || !pass) {
    console.log(`\n==============================================`);
    console.log(`[DEVELOPMENT MAIL LOG] OTP for ${toEmail}: ${otp}`);
    console.log(`(Add SMTP_USER and SMTP_PASS to .env to send real emails)`);
    console.log(`==============================================\n`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9fafb;">
        <h2 style="color: #16a34a; text-align: center; margin-bottom: 20px;">🌿 Pahadi CropSathi</h2>
        <p style="font-size: 16px; color: #374151;">Hello,</p>
        <p style="font-size: 15px; color: #4b5563;">Your One-Time Verification Code (OTP) for authentication is:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16a34a; background: #eef2ff; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center;">This code will expire in <strong>5 minutes</strong>. Do not share this OTP with anyone.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">AgriVision AI - Pahadi CropSathi © ${new Date().getFullYear()}</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Pahadi CropSathi Auth" <${user}>`,
      to: toEmail,
      subject: `Your Verification Code: ${otp}`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error('Failed to send OTP email via Nodemailer:', error);
    // Still return true in development mode to avoid breaking auth flow if credentials are mock
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[FALLBACK LOG] OTP for ${toEmail}: ${otp}`);
      return true;
    }
    return false;
  }
}
