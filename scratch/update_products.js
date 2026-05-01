const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  
  const skinTypes = ['Oily', 'Dry', 'Sensitive', 'Combination'];
  const commonIngredients = ['Centella Asiatica', 'Niacinamide', 'Hyaluronic Acid', 'Rice Bran Water', 'Glycerin', 'Ceramide', 'Vitamin C'];

  for (const product of products) {
    // Assign random skin types (1-2)
    const shuffledTypes = skinTypes.sort(() => 0.5 - Math.random());
    const assignedTypes = shuffledTypes.slice(0, Math.round(Math.random() * 1) + 1);
    
    // Assign random ingredients (2-4)
    const shuffledIngreds = commonIngredients.sort(() => 0.5 - Math.random());
    const assignedIngreds = shuffledIngreds.slice(0, Math.round(Math.random() * 2) + 2);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        skinType: JSON.stringify(assignedTypes),
        ingredients: JSON.stringify(assignedIngreds)
      }
    });
  }
  console.log('Updated products with skin types and ingredients.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
