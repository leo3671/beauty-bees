const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding All Products from data.json...');
  
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  
  for (const product of data) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description || '',
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
        image: product.image,
        stock: 50, // Default stock for seeding
        inStock: true,
        skinType: JSON.stringify(product.skinType || []),
        ingredients: JSON.stringify(product.ingredients || [])
      },
      create: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        description: product.description || '',
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        isNew: product.isNew || false,
        isBestSeller: product.isBestSeller || false,
        image: product.image,
        stock: 50,
        inStock: true,
        skinType: JSON.stringify(product.skinType || []),
        ingredients: JSON.stringify(product.ingredients || [])
      }
    });
  }
  
  console.log('🌱 Seeding Shipping Zones...');
  const zones = [
    { name: 'Inside Kathmandu Valley', fee: 100 },
    { name: 'Outside Kathmandu Valley', fee: 200 },
    { name: 'Pick-up from Store (New Road)', fee: 0 }
  ];
  for (const zone of zones) {
    await prisma.shippingZone.upsert({
      where: { name: zone.name },
      update: zone,
      create: zone
    });
  }

  console.log('🌱 Seeding Discount Vouchers...');
  const vouchers = [
    { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderValue: 2000, isActive: true },
    { code: 'KBEAUTY500', discountType: 'fixed', discountValue: 500, minOrderValue: 5000, isActive: true },
    { code: 'BEEFREESHIP', discountType: 'fixed', discountValue: 0, minOrderValue: 10000, isActive: true }
  ];
  for (const v of vouchers) {
    await prisma.discountVoucher.upsert({
      where: { code: v.code },
      update: v,
      create: v
    });
  }
  
  console.log(`✅ Seeding Complete! Seeded ${data.length} products, ${zones.length} zones, and ${vouchers.length} vouchers.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
