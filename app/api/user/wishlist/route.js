import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: supabaseUser.id },
      include: {
        product: true
      }
    });

    return NextResponse.json({ success: true, items: wishlistItems.map(item => item.product) });
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if it already exists
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: supabaseUser.id,
          productId: productId
        }
      }
    });

    if (existing) {
      // Remove it
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: supabaseUser.id,
            productId: productId
          }
        }
      });
      return NextResponse.json({ success: true, added: false, message: 'Removed from wishlist' });
    } else {
      // Add it
      await prisma.wishlist.create({
        data: {
          userId: supabaseUser.id,
          productId: productId
        }
      });
      return NextResponse.json({ success: true, added: true, message: 'Added to wishlist' });
    }
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 });
  }
}
