import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { name: 'asc' }
    });
    return new Response(JSON.stringify(zones), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch zones" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, fee } = await req.json();
    const zone = await prisma.shippingZone.create({
      data: { name, fee: parseInt(fee) }
    });
    return new Response(JSON.stringify(zone), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create zone" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, fee } = await req.json();
    const zone = await prisma.shippingZone.update({
      where: { id },
      data: { name, fee: parseInt(fee) }
    });
    return new Response(JSON.stringify(zone), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update zone" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.shippingZone.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete zone" }), { status: 500 });
  }
}
