import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a reusable transporter using Gmail SMTP
function getTransporter() {
  // Use Gmail App Password for sending
  // The user must generate an "App Password" at https://myaccount.google.com/apppasswords
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn('[EMAIL] GMAIL_USER or GMAIL_APP_PASSWORD not set. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
}

export async function sendOTP(email, otp, type = 'EMAIL_VERIFICATION') {
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Clean up old tokens for this email/type to avoid unique constraint issues
  try {
    await prisma.verificationToken.deleteMany({
      where: { email, type }
    });
  } catch (e) {
    // Ignore cleanup errors
  }

  // Save new token to DB
  await prisma.verificationToken.create({
    data: { email, token: otp, expires, type }
  });

  const transporter = getTransporter();

  if (!transporter) {
    // No Gmail credentials — log OTP to terminal for dev testing
    console.log(`\n========================================`);
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    console.log(`Type: ${type} | Expires in 10 minutes`);
    console.log(`========================================\n`);
    return true;
  }

  // Determine subject based on type
  let subject = 'Your Beauty Bees Verification Code';
  if (type === 'PASSWORD_RESET') subject = 'Reset Your Beauty Bees Password';

  try {
    await transporter.sendMail({
      from: `"Beauty Bees" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; border: 1px solid #f0e6e8; border-radius: 16px; background: #fffbfc;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px;">🐝</span>
            <h2 style="color: #be185d; margin: 8px 0 0;">Beauty Bees</h2>
          </div>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello,</p>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            ${type === 'PASSWORD_RESET' ? 'Your password reset code is:' : 'Your verification code is:'}
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #fdf2f8, #fce7f3); border-radius: 12px; border: 2px dashed #f9a8d4;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #be185d;">${otp}</span>
            </div>
          </div>
          <p style="color: #64748b; font-size: 13px; text-align: center;">This code expires in <strong>10 minutes</strong>.</p>
          <hr style="border: none; border-top: 1px solid #fce7f3; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If you didn't request this, please ignore this email.<br/>
            Beauty Bees — Authentic Korean Skincare in Nepal 🇳🇵
          </p>
        </div>
      `
    });
    console.log(`[EMAIL] ✅ Code sent to ${email}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] ❌ Send failed:', error.message);
    // Still return true so the user can use devOTP fallback
    return false;
  }
}

export async function verifyOTP(email, token, type) {
  const record = await prisma.verificationToken.findFirst({
    where: { email, token, type }
  });

  if (!record || new Date() > record.expires) {
    return false;
  }

  // Delete after successful verification
  await prisma.verificationToken.delete({
    where: { id: record.id }
  });

  return true;
}
