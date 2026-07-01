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
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
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

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Call Supabase Auth signUp
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password.trim(),
      options: {
        data: {
          name: sanitizedName,
          phone: cleanPhone,
          role: 'customer'
        }
      }
    });

    if (error) {
      console.error("Supabase Register Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const supabaseUser = data.user;
    if (!supabaseUser) {
      return NextResponse.json({ error: 'Failed to create account in auth service' }, { status: 500 });
    }

    // Upsert user details into local Prisma DB for relational integrity
    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        name: sanitizedName,
        phone: cleanPhone,
        role: 'customer',
        isVerified: supabaseUser.email_confirmed_at ? true : false,
      },
      create: {
        id: supabaseUser.id,
        name: sanitizedName,
        email: cleanEmail,
        phone: cleanPhone,
        password: 'supabase_auth', // Placeholder to satisfy schema constraints
        role: 'customer',
        isVerified: supabaseUser.email_confirmed_at ? true : false,
      }
    });

    const requiresVerification = !data.session && !supabaseUser.email_confirmed_at;

    return NextResponse.json({ 
      success: true, 
      message: requiresVerification ? 'Account created. Please verify your email.' : 'Account created successfully.',
      requiresVerification,
      email: cleanEmail
    }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
