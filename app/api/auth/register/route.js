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

// Strong password validator
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('one number');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('one special character');
  return errors;
}

// Email validator
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone validator (Nepal format)
function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+977)?9[678]\d{8}$/.test(cleaned) || /^9[678]\d{8}$/.test(cleaned);
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 });
    }

    const { name, email, phone, password } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Sanitize name (prevent XSS)
    const sanitizedName = name.replace(/[<>]/g, '').trim().slice(0, 100);
    
    if (sanitizedName.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Validate phone
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Please enter a valid Nepal phone number (98XXXXXXXX)' }, { status: 400 });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return NextResponse.json({ 
        error: `Password must contain: ${passwordErrors.join(', ')}` 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Hash password with bcrypt (cost factor 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: email.toLowerCase().trim(),
        phone: phone.replace(/[\s\-\(\)]/g, ''),
        password: hashedPassword,
        role: 'customer',
        isVerified: false
      }
    });

    // Send Verification OTP
    const otp = generateOTP();
    await sendOTP(user.email, otp, 'EMAIL_VERIFICATION');

    return NextResponse.json({ 
      success: true, 
      message: 'Account created. Please verify your email.',
      requiresVerification: true,
      email: user.email 
    }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
