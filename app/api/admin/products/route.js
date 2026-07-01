import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { uploadToSupabase } from '@/lib/supabase';

// Helper to determine active media hosting
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export async function POST(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return unauthorizedResponse();

    const newProduct = await request.json();

    // Process image uploads (base64)
    if (newProduct.imageBase64) {
      let imageUrl = '';
      if (isCloudinaryConfigured()) {
        console.log('[MEDIA] Uploading product image to Cloudinary');
        imageUrl = await uploadToCloudinary(newProduct.imageBase64, 'products');
      } else {
        console.log('[MEDIA] Cloudinary not configured. Falling back to Supabase Storage');
        const fileName = `${newProduct.id || Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        imageUrl = await uploadToSupabase(newProduct.imageBase64, 'products', fileName);
      }
      newProduct.image = imageUrl;
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
        image: newProduct.image || '',
        skinType: JSON.stringify(newProduct.skinType || []),
        ingredients: JSON.stringify(newProduct.ingredients || [])
      }
    });
    
    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error("Admin POST Product Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to add product' }, { status: 500 });
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

    // Process updated image uploads (base64)
    if (updatedProduct.imageBase64) {
      let imageUrl = '';
      if (isCloudinaryConfigured()) {
        console.log('[MEDIA] Uploading updated product image to Cloudinary');
        imageUrl = await uploadToCloudinary(updatedProduct.imageBase64, 'products');
      } else {
        console.log('[MEDIA] Cloudinary not configured. Falling back to Supabase Storage');
        const fileName = `${id}-${Date.now()}.png`;
        imageUrl = await uploadToSupabase(updatedProduct.imageBase64, 'products', fileName);
      }
      updatedProduct.image = imageUrl;
      delete updatedProduct.imageBase64;
    }

    const data = { ...updatedProduct };
    delete data.id; // avoid updating PK
    
    // Enforce data types for schema
    if (data.originalPrice !== undefined) data.originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.stock !== undefined) {
      data.stock = Number(data.stock);
      data.inStock = data.stock > 0;
    }
    
    // Array stringifications
    if (Array.isArray(data.skinType)) data.skinType = JSON.stringify(data.skinType);
    if (Array.isArray(data.ingredients)) data.ingredients = JSON.stringify(data.ingredients);

    // Strip database metadata
    delete data.updatedAt;
    delete data.createdAt;
    delete data.reviews;

    const result = await prisma.product.update({
      where: { id },
      data: data
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin PUT Product Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
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
    console.error("Admin DELETE Product Error:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
