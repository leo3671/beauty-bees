import prisma from '@/lib/prisma';
import { sendCancellationRequest } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { orderId, reason } = await req.json();
    
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Restriction: Cannot request cancellation if status is not Pending
    if (order.status !== 'Pending') {
      return NextResponse.json({ error: "Order cannot be cancelled at this stage" }, { status: 400 });
    }

    try {
      await sendCancellationRequest(order, reason);
    } catch (e) {
      console.error("Email delivery failed:", e);
      return NextResponse.json({ error: "Failed to send cancellation request email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Cancellation request submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Cancellation request error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
