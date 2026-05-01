import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newProduct = await request.json();

    // Handle image upload if base64 provided
    if (newProduct.imageBase64) {
      const base64Data = newProduct.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const ext = newProduct.imageBase64.substring("data:image/".length, newProduct.imageBase64.indexOf(";base64"));
      const fileName = `custom_${Date.now()}.${ext}`;
      const filePath = path.join(process.cwd(), 'public', 'images', fileName);
      
      fs.writeFileSync(filePath, base64Data, 'base64');
      newProduct.image = `/images/${fileName}`;
      delete newProduct.imageBase64;
    }

    const createdProduct = await prisma.product.create({
      data: {
        id: newProduct.id || 'p_' + Date.now(),
        name: newProduct.name,
        brand: newProduct.brand,
        category: newProduct.category,
        description: newProduct.description || '',
        price: Number(newProduct.price),
        originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
        isNew: newProduct.isNew || false,
        isBestSeller: newProduct.isBestSeller || false,
        stock: Number(newProduct.stock || 0),
        inStock: Number(newProduct.stock || 0) > 0,
        image: newProduct.image
      }
    });
    
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedProduct = await request.json();
    const id = updatedProduct.id;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Handle image upload if base64 provided
    if (updatedProduct.imageBase64) {
      const base64Data = updatedProduct.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const ext = updatedProduct.imageBase64.substring("data:image/".length, updatedProduct.imageBase64.indexOf(";base64"));
      const fileName = `custom_${Date.now()}.${ext}`;
      const filePath = path.join(process.cwd(), 'public', 'images', fileName);
      
      fs.writeFileSync(filePath, base64Data, 'base64');
      updatedProduct.image = `/images/${fileName}`;
      delete updatedProduct.imageBase64;
    }

    const data = { ...updatedProduct };
    delete data.id; // don't update ID
    
    // Clean up specific keys to match schema precisely if they exist but are nullish
    if (data.originalPrice !== undefined) data.originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.stock !== undefined) {
      data.stock = Number(data.stock);
      data.inStock = data.stock > 0;
    }
    
    // Strip updatedAt if passed so Prisma handles it
    delete data.updatedAt;
    delete data.createdAt;

    const result = await prisma.product.update({
      where: { id },
      data: data
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
