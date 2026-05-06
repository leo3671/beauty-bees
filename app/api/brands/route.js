import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadToSupabase } from '@/lib/supabase';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const brands = await prisma.brand.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("GET Brands Error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const { id, isActive } = await req.json();
    const brand = await prisma.brand.update({
      where: { id },
      data: { isActive }
    });
    return NextResponse.json(brand);
  } catch (error) {
    console.error("PATCH Brand Error:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const { name, logo } = await req.json();
    
    if (!name || !logo) {
      return NextResponse.json({ error: "Name and Logo are required" }, { status: 400 });
    }

    let logoUrl = logo;
    if (logo && logo.startsWith('data:image')) {
      const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
      logoUrl = await uploadToSupabase(logo, 'brands', fileName);
    }

    const brand = await prisma.brand.upsert({
      where: { name },
      update: { logo: logoUrl },
      create: { name, logo: logoUrl }
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Brand API Error:", error);
    return NextResponse.json({ error: "Failed to save brand" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const { id } = await req.json();
    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Brand Error:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
