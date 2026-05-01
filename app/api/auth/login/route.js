import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/session';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateOTP, sendOTP } from '@/lib/auth-utils';

const prisma = new PrismaClient();

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

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    // Find user in database
    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if verified
    if (!user.isVerified) {
      const otp = generateOTP();
      await sendOTP(user.email, otp, 'EMAIL_VERIFICATION');
      return NextResponse.json({ 
        requiresVerification: true, 
        email: user.email, 
        message: 'Please verify your email to continue.' 
      }, { status: 403 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check for MFA
    if (user.mfaEnabled) {
      const otp = generateOTP();
      await sendOTP(user.email, otp, 'MFA');
      return NextResponse.json({ 
        requiresMFA: true, 
        email: user.email, 
        message: 'Please enter your MFA code.' 
      });
    }

    // Create secure session
    const session = await getSession();
    session.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    await session.save();

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
