import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOTP, sendOTP } from '@/lib/auth-utils';
import { sendSMS } from '@/lib/sms-utils';

export async function POST(request) {
  try {
    const { email, type } = await request.json(); // type: 'EMAIL_VERIFICATION' or 'MFA'

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const otp = generateOTP();
    const sent = await sendOTP(email, otp, type);

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'New code sent' });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 });
  }
}
