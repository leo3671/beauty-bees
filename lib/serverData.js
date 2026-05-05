import prisma from '@/lib/prisma';

export async function getLiveProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return products;
  } catch (error) {
    console.error("Prisma Fetch Error:", error);
    return [];
  }
}
