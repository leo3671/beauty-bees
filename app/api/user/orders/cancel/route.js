import prisma from '@/lib/prisma';
import { sendOrderCancelled } from '@/lib/email';

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });

    // Restriction: Cannot cancel if status is Shipped, Delivered, or Returned
    if (order.status !== 'Pending') {
      return new Response(JSON.stringify({ error: "Order cannot be cancelled at this stage" }), { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'Cancelled' },
      include: { items: true }
    });

    try { await sendOrderCancelled(updatedOrder); } catch (e) { console.error(e); }

    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Cancellation failed" }), { status: 500 });
  }
}
