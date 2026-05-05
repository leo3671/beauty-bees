import { getSession } from './session';
import { NextResponse } from 'next/server';

/**
 * Verifies if the current session belongs to an administrator.
 * Used for protecting sensitive API routes and server-side operations.
 */
export async function verifyAdmin() {
  const session = await getSession();
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return false;
  }
  
  return session.user;
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
