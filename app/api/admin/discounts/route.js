import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vouchers = await prisma.discountVoucher.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return new Response(JSON.stringify(vouchers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch vouchers" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const voucher = await prisma.discountVoucher.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: parseInt(data.discountValue),
        minOrderValue: parseInt(data.minOrderValue || 0),
        isActive: true
      }
    });
    return new Response(JSON.stringify(voucher), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create voucher" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.discountVoucher.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete voucher" }), { status: 500 });
  }
}
