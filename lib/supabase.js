import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton browser client pattern to avoid creating multiple clients
let browserClient = null;

export function createSupabaseBrowserClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are missing');
  }
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}

export async function createSupabaseServerClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are missing');
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
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

/**
 * Uploads a base64 image to a Supabase Storage bucket.
 * @param {string} base64Data - The image data in base64 format (with or without data:image/xxx;base64 prefix)
 * @param {string} bucket - The destination bucket name (e.g., 'products', 'brands')
 * @param {string} path - The destination path/filename within the bucket
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadToSupabase(base64Data, bucket, path) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase environment variables are missing');
  }

  // Remove data:image/xxx;base64 prefix if exists
  const base64String = base64Data.includes('base64,') 
    ? base64Data.split('base64,')[1] 
    : base64Data;

  // Convert base64 to binary
  const binaryData = Buffer.from(base64String, 'base64');

  // Determine content type
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
      'x-upsert': 'true' // Overwrite if exists
    },
    body: binaryData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Supabase Storage Error: ${error.message || response.statusText}`);
  }

  // Construct the public URL
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
