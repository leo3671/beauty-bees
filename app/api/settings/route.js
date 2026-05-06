import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    // Try using Prisma model if generated
    let settings;
    try {
      settings = await prisma.siteSettings.findUnique({
        where: { id: 'global' }
      });
    } catch (e) {
      // Fallback to raw query if model not in generated client
      const raw = await prisma.$queryRaw`SELECT * FROM "SiteSettings" WHERE id = 'global' LIMIT 1`;
      settings = raw[0];
    }

    if (!settings) {
      return NextResponse.json({ 
        siteName: 'Beauty Bees',
        logoUrl: null 
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return NextResponse.json(
      { siteName: 'Beauty Bees', logoUrl: null },
      { status: 200 } // Return defaults instead of error
    );
  }
}
