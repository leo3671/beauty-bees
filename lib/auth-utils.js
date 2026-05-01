import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_123');

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email, otp, type = 'EMAIL_VERIFICATION') {
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save to DB
  await prisma.verificationToken.upsert({
    where: { email_token: { email, token: otp } },
    update: { expires, type },
    create: { email, token: otp, expires, type }
  });

  // If no API key, log to console (for development)
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV] OTP for ${email}: ${otp} (${type})`);
    return true;
  }

  try {
    await resend.emails.send({
      from: 'Beauty Bees <security@beautybees.com>',
      to: email,
      subject: type === 'MFA' ? 'Your MFA Login Code' : 'Verify Your Beauty Bees Account',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f2b6c1;">Beauty Bees Security</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; margin: 20px 0;">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export async function verifyOTP(email, token, type) {
  const record = await prisma.verificationToken.findUnique({
    where: { email_token: { email, token } }
  });

  if (!record || record.type !== type || new Date() > record.expires) {
    return false;
  }

  // Delete after use
  await prisma.verificationToken.delete({
    where: { id: record.id }
  });

  return true;
}
