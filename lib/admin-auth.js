import { createSupabaseServerClient } from './supabase';
import { NextResponse } from 'next/server';

/**
 * Verifies if the current session belongs to an administrator.
 * Used for protecting sensitive API routes and server-side operations.
 */
export async function verifyAdmin() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }
    
    // Support role extraction from metadata
    const role = user.user_metadata?.role || user.app_metadata?.role;
    if (role !== 'admin') {
      return false;
    }
    
    return user;
  } catch (error) {
    console.error("[AUTH] verifyAdmin error:", error);
    return false;
  }
}

/**
 * Standard Next.js Response for unauthorized admin access.
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized: Administrative access required.' },
    { status: 403 }
  );
}
