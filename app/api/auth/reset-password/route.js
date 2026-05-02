import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyOTP } from '@/lib/auth-utils';

export async function POST(request) {
  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Verify OTP
    const isValid = await verifyOTP(sanitizedEmail, otp, 'PASSWORD_RESET');
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { email: sanitizedEmail },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
