import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';

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
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const newProduct = await request.json();

    // Handle image upload if base64 provided
    if (newProduct.imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(newProduct.imageBase64, {
        folder: 'beauty-bees/products',
        quality: 'auto',
        fetch_format: 'auto'
      });
      newProduct.image = uploadResponse.secure_url;
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
        image: newProduct.image,
        skinType: JSON.stringify(newProduct.skinType || []),
        ingredients: JSON.stringify(newProduct.ingredients || [])
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
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

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
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const updatedProduct = await request.json();
    const id = updatedProduct.id;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Handle image upload if base64 provided
    if (updatedProduct.imageBase64) {
      const uploadResponse = await cloudinary.uploader.upload(updatedProduct.imageBase64, {
        folder: 'beauty-bees/products',
        quality: 'auto',
        fetch_format: 'auto'
      });
      updatedProduct.image = uploadResponse.secure_url;
      delete updatedProduct.imageBase64;
    }

    const data = { ...updatedProduct };
    delete data.id; // don't update ID
    
    // Clean up specific keys to match schema precisely
    if (data.originalPrice !== undefined) data.originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.stock !== undefined) {
      data.stock = Number(data.stock);
      data.inStock = data.stock > 0;
    }
    
    // Stringify arrays if they exist
    if (Array.isArray(data.skinType)) data.skinType = JSON.stringify(data.skinType);
    if (Array.isArray(data.ingredients)) data.ingredients = JSON.stringify(data.ingredients);

    // Strip updatedAt/createdAt
    delete data.updatedAt;
    delete data.createdAt;
    delete data.reviews;

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
