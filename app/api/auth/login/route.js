import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateOTP, sendOTP } from '@/lib/auth-utils';

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

    const { email, password, rememberMe = false } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Sanitize email strictly
    const sanitizedEmail = email.toLowerCase().trim();

    // Find user in database
    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
    
    if (!user) {
      console.log(`[AUTH] Login failed: User not found (${sanitizedEmail})`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if verified
    if (!user.isVerified) {
      console.log(`[AUTH] Login blocked: User not verified (${sanitizedEmail})`);
      const otp = generateOTP();
      await sendOTP(user.email, otp, 'EMAIL_VERIFICATION');
      return NextResponse.json({ 
        requiresVerification: true, 
        email: user.email, 
        message: 'Please verify your email to continue.',
        devOTP: (process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD !== 'PASTE_YOUR_APP_PASSWORD_HERE') ? null : otp
      }, { status: 403 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log(`[AUTH] Login failed: Password mismatch (${sanitizedEmail})`);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create secure session
    const session = await getSession(rememberMe);
    session.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    await session.save();

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
