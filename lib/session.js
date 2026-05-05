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
  
  // Clone options and update maxAge
  const options = {
    ...sessionOptions,
    cookieOptions: {
      ...sessionOptions.cookieOptions,
      // If rememberMe: 30 days, else 7 days (standard persistence)
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    }
  };

  const session = await getIronSession(cookieStore, options);
  return session;
}
