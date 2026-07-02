import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, comment, images } = await request.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch user details for userName mapping
    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      select: { name: true }
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: supabaseUser.id,
        userName: dbUser?.name || supabaseUser.user_metadata?.name || 'Valued Customer',
        rating: parseInt(rating),
        comment,
        images: JSON.stringify(images || [])
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review Post Error:", error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
