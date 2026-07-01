import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, token, type } = await request.json(); 
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call Supabase Auth verifyOtp
    const supabase = await createSupabaseServerClient();
    
    // In Supabase, the verification type is 'signup' for email confirmations, and 'sms' for phone
    const verifyType = type === 'PHONE_VERIFICATION' ? 'sms' : 'signup';

    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: verifyType
    });

    if (error) {
      console.error(`[AUTH] Verification failed for ${normalizedEmail}: ${error.message}`);
      return NextResponse.json({ error: error.message || 'Invalid or expired code' }, { status: 400 });
    }

    const supabaseUser = data.user;
    if (!supabaseUser) {
      return NextResponse.json({ error: 'Verification succeeded but user details were not returned' }, { status: 400 });
    }

    // Sync profile status in our local Prisma User table
    const localUser = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        isVerified: true
      },
      create: {
        id: supabaseUser.id,
        email: normalizedEmail,
        name: supabaseUser.user_metadata?.name || '',
        phone: supabaseUser.user_metadata?.phone || '',
        password: 'supabase_auth',
        role: supabaseUser.user_metadata?.role || 'customer',
        isVerified: true
      }
    });

    return NextResponse.json({ success: true, role: localUser.role });
  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
