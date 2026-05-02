import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long_for_security_123456789',
  cookieName: 'beautybees_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession(rememberMe = false) {
  const cookieStore = await cookies();
  
  // Clone options and update maxAge if rememberMe is true
  const options = {
    ...sessionOptions,
    cookieOptions: {
      ...sessionOptions.cookieOptions,
      // If rememberMe: 30 days, else 1 day (standard session)
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
    }
  };

  const session = await getIronSession(cookieStore, options);
  return session;
}
