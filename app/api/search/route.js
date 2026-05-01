import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { brand: { contains: query } },
          { category: { contains: query } }
        ]
      },
      take: 5,
      select: {
        id: true,
        name: true,
        brand: true,
        image: true,
        price: true
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
