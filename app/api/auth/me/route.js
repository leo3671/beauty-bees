import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch fresh user data from DB using ID
    const user = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, mfaEnabled: true }
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Auth Me API Error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
