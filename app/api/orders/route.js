import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmation, sendPaymentVerificationEmail, sendOrderDelivered, sendOrderCancelled } from '@/lib/email';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

const prisma = new PrismaClient();
const imagesDir = path.join(process.cwd(), 'public', 'images');

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newOrderData = await request.json();

    let paymentScreenshot = null;
    if (newOrderData.paymentScreenshotBase64) {
      paymentScreenshot = newOrderData.paymentScreenshotBase64;
    }

    const createdOrder = await prisma.order.create({
      data: {
        id: 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100),
        customer: newOrderData.customer,
        email: newOrderData.email,
        location: newOrderData.location || '',
        paymentMethod: newOrderData.paymentMethod || 'Cash on Delivery',
        paymentStatus: (newOrderData.paymentMethod || 'Cash on Delivery') === 'Cash on Delivery' ? 'Verified' : 'Pending Verification',
        paymentScreenshot: paymentScreenshot,
        status: 'Pending',
        total: Number(newOrderData.total),
        discountCode: newOrderData.discountCode || null,
        discountAmount: Number(newOrderData.discountAmount || 0),
        shippingFee: Number(newOrderData.shippingFee || 0),
        items: {
          create: newOrderData.items.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: Number(item.quantity),
            price: Number(item.price || 0)
          }))
        }
      },
      include: {
        items: true
      }
    });
    
    // Trigger order confirmation email
    try { await sendOrderConfirmation(createdOrder); } catch (e) { console.error('Email send failed:', e); }
    
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const { id, status, paymentStatus } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    // Fetch order first to check previous status for stock logic
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only deduct stock if status is changing to 'Delivered' and wasn't 'Delivered' before
    const isTransitioningToDelivered = status === 'Delivered' && currentOrder.status !== 'Delivered';

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
      include: { items: true }
    });

    if (isTransitioningToDelivered) {
      // Deduct stock for each item
      for (const item of updatedOrder.items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: newStock,
              inStock: newStock > 0
            }
          });
        }
      }
    }

    if (paymentStatus === 'Verified') {
      try { await sendPaymentVerificationEmail(updatedOrder); } catch (e) { console.error('Email send failed:', e); }
    }

    if (status === 'Delivered') {
      try { await sendOrderDelivered(updatedOrder); } catch (e) { console.error('Email send failed:', e); }
    }

    if (status === 'Cancelled') {
      try { await sendOrderCancelled(updatedOrder); } catch (e) { console.error('Email send failed:', e); }
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
