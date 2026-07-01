import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import prisma from '@/lib/prisma';

// Simple in-memory rate limiter
const attempts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.firstAttempt > RATE_LIMIT_WINDOW) {
    attempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) return false;
  record.count++;
  return true;
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many login attempts. Please wait 1 minute.' }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Call Supabase Auth to establish the session
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password
    });

    if (error) {
      console.log(`[AUTH] Login failed for ${sanitizedEmail}: ${error.message}`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const supabaseUser = data.user;
    if (!supabaseUser) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Sync user details to Prisma for relational consistency
    const userRole = supabaseUser.user_metadata?.role || 'customer';
    const userName = supabaseUser.user_metadata?.name || '';
    const userPhone = supabaseUser.user_metadata?.phone || '';

    const localUser = await prisma.user.upsert({
      where: { email: sanitizedEmail },
      update: {
        name: userName,
        phone: userPhone,
        role: userRole,
        isVerified: supabaseUser.email_confirmed_at ? true : false,
      },
      create: {
        id: supabaseUser.id,
        email: sanitizedEmail,
        name: userName,
        phone: userPhone,
        password: 'supabase_auth', // Placeholder
        role: userRole,
        isVerified: supabaseUser.email_confirmed_at ? true : false,
      }
    });

    // Check if verified
    if (!supabaseUser.email_confirmed_at) {
      console.log(`[AUTH] Login blocked: User email not verified (${sanitizedEmail})`);
      return NextResponse.json({ 
        requiresVerification: true, 
        email: sanitizedEmail, 
        message: 'Please verify your email to continue.'
      }, { status: 403 });
    }

    return NextResponse.json({ success: true, role: localUser.role });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
