import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use SQLite local prisma fallback in case the global client is imported outside server context
const prisma = new PrismaClient();

// Cookie name for local mock authentication
const MOCK_COOKIE_NAME = 'sb-mock-user-session';

// MOCK AUTH CLIENT FOR LOCAL TESTING / DEV MODE
const createMockAuthClient = (isServer = false, cookieStore = null) => {
  return {
    auth: {
      signUp: async ({ email, password, options }) => {
        const cleanEmail = email.toLowerCase().trim();
        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (existing) {
          return { data: { user: null }, error: new Error('User already exists') };
        }

        const mockUser = {
          id: `mock-uuid-${Date.now()}`,
          email: cleanEmail,
          email_confirmed_at: null, // Forces verification flow
          user_metadata: options?.data || {}
        };

        // Create verification token
        const otpCode = "123456";
        await prisma.verificationToken.upsert({
          where: { email_token: { email: cleanEmail, token: otpCode } },
          update: { expires: new Date(Date.now() + 3600 * 1000) },
          create: {
            email: cleanEmail,
            token: otpCode,
            type: 'EMAIL_VERIFICATION',
            expires: new Date(Date.now() + 3600 * 1000)
          }
        });

        return { 
          data: { 
            user: mockUser, 
            session: null 
          }, 
          error: null 
        };
      },

      verifyOtp: async ({ email, token, type }) => {
        const cleanEmail = email.toLowerCase().trim();
        const verification = await prisma.verificationToken.findFirst({
          where: { email: cleanEmail, token }
        });

        if (!verification || verification.expires < new Date()) {
          return { data: { user: null }, error: new Error('Invalid or expired verification code') };
        }

        // Cleanup token
        await prisma.verificationToken.delete({
          where: { id: verification.id }
        });

        const mockUser = {
          id: `mock-user-id-${Date.now()}`,
          email: cleanEmail,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: { role: 'customer', name: 'QA Test', phone: '9800000000' }
        };

        if (isServer && cookieStore) {
          cookieStore.set(MOCK_COOKIE_NAME, JSON.stringify(mockUser), { path: '/' });
        } else if (typeof window !== 'undefined') {
          document.cookie = `${MOCK_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(mockUser))}; path=/;`;
        }

        return { 
          data: { 
            user: mockUser, 
            session: { access_token: 'mock-jwt-token' } 
          }, 
          error: null 
        };
      },

      signInWithPassword: async ({ email, password }) => {
        const cleanEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        
        if (!user) {
          return { data: { user: null }, error: new Error('Invalid email or password') };
        }

        const mockUser = {
          id: user.id,
          email: user.email,
          email_confirmed_at: user.isVerified ? new Date().toISOString() : null,
          user_metadata: { name: user.name, phone: user.phone, role: user.role }
        };

        if (isServer && cookieStore) {
          cookieStore.set(MOCK_COOKIE_NAME, JSON.stringify(mockUser), { path: '/' });
        } else if (typeof window !== 'undefined') {
          document.cookie = `${MOCK_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(mockUser))}; path=/;`;
        }

        return { 
          data: { 
            user: mockUser, 
            session: { access_token: 'mock-jwt-token' } 
          }, 
          error: null 
        };
      },

      getUser: async () => {
        let sessionStr = null;
        if (isServer && cookieStore) {
          sessionStr = cookieStore.get(MOCK_COOKIE_NAME)?.value;
        } else if (typeof window !== 'undefined') {
          const match = document.cookie.match(new RegExp('(^| )' + MOCK_COOKIE_NAME + '=([^;]*)'));
          if (match) sessionStr = decodeURIComponent(match[2]);
        }

        if (!sessionStr) {
          return { data: { user: null }, error: new Error('No active session') };
        }

        try {
          const user = JSON.parse(sessionStr);
          return { data: { user }, error: null };
        } catch (e) {
          return { data: { user: null }, error: e };
        }
      },

      signOut: async () => {
        if (isServer && cookieStore) {
          cookieStore.delete(MOCK_COOKIE_NAME);
        } else if (typeof window !== 'undefined') {
          document.cookie = `${MOCK_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        }
        return { error: null };
      }
    }
  };
};

let browserClient = null;

export function createSupabaseBrowserClient() {
  // If no URL or local placeholder URL is used, fall back to mock auth
  if (!SUPABASE_URL || SUPABASE_URL.includes('example.supabase.co')) {
    return createMockAuthClient(false);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

export async function createSupabaseServerClient() {
  if (!SUPABASE_URL || SUPABASE_URL.includes('example.supabase.co')) {
    const cookieStore = await cookies();
    return createMockAuthClient(true, cookieStore);
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          // Can be ignored if handled by middleware
        }
      },
    },
  });
}

/**
 * Uploads a base64 image to a Supabase Storage bucket.
 */
export async function uploadToSupabase(base64Data, bucket, path) {
  if (!SUPABASE_URL || SUPABASE_URL.includes('example.supabase.co')) {
    console.log(`[MOCK STORAGE] Uploaded to bucket ${bucket} path ${path}`);
    return `/logo_fixed.png`;
  }

  const base64String = base64Data.includes('base64,') 
    ? base64Data.split('base64,')[1] 
    : base64Data;

  const binaryData = Buffer.from(base64String, 'base64');

  let contentType = 'image/png';
  if (base64Data.includes('image/jpeg') || base64Data.includes('image/jpg')) contentType = 'image/jpeg';
  else if (base64Data.includes('image/webp')) contentType = 'image/webp';

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'apikey': SUPABASE_ANON_KEY,
      'Content-Type': contentType,
      'x-upsert': 'true'
    },
    body: binaryData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Supabase Storage Error: ${error.message || response.statusText}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
