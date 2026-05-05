import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyOTP } from '@/lib/auth-utils';
import { getSession } from '@/lib/session';

export async function POST(request) {
  try {
    const { email, token, type } = await request.json(); 
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !token || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isValid = await verifyOTP(normalizedEmail, token, type);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (type === 'EMAIL_VERIFICATION' || type === 'PHONE_VERIFICATION') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });
    }

    // Create session if it was a verification or MFA success
    const session = await getSession();
    session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
    await session.save();

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
