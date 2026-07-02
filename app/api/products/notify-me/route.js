import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { productId, email } = await request.json();

    if (!productId || !email) {
      return NextResponse.json({ error: 'Product ID and email are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Verify product exists and is notify-enabled
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create or upsert notification request
    await prisma.stockNotification.upsert({
      where: {
        productId_email: {
          productId,
          email
        }
      },
      update: {}, // If it already exists, do nothing
      create: {
        productId,
        email
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'We will notify you when this item is back in stock!' 
    });
  } catch (error) {
    console.error("Stock Notification Error:", error);
    return NextResponse.json({ error: 'Failed to submit notification request' }, { status: 500 });
  }
}
