import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOTP, sendOTP } from '@/lib/auth-utils';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (!user) {
      // For security, don't reveal if user exists, but here we can be helpful
      return NextResponse.json({ error: 'Account with this email address not found' }, { status: 404 });
    }

    const otp = generateOTP();
    await sendOTP(user.email, otp, 'PASSWORD_RESET');

    return NextResponse.json({ 
      success: true, 
      message: 'Reset code sent to your email',
      devOTP: (process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD !== 'PASTE_YOUR_APP_PASSWORD_HERE') ? null : otp
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
