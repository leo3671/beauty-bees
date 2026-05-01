import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (session.user) {
    // Fetch fresh user data from DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, mfaEnabled: true }
    });
    return NextResponse.json({ user });
  }
  return NextResponse.json({ user: null }, { status: 401 });
}
