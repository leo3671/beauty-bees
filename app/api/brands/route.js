import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("GET Brands Error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, logo } = await req.json();
    
    if (!name || !logo) {
      return NextResponse.json({ error: "Name and Logo are required" }, { status: 400 });
    }

    const brand = await prisma.brand.upsert({
      where: { name },
      update: { logo },
      create: { name, logo }
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Brand API Error:", error);
    return NextResponse.json({ error: "Failed to save brand" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Brand Error:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
