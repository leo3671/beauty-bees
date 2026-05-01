const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialProducts = [
  {
    id: "p1",
    name: "Anua Heartleaf Pore Control Cleansing Oil",
    brand: "Anua",
    category: "Cleanser",
    description: "Best-selling Korean cleansing oil for pore control.",
    price: 2800,
    isNew: true,
    isBestSeller: true,
    stock: 50,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
    skinType: JSON.stringify(["Oily", "Sensitive"]),
    ingredients: JSON.stringify(["Heartleaf", "Jojoba Oil"])
  },
  {
    id: "p2",
    name: "Skin1004 Madagascar Centella Ampoule",
    brand: "Skin1004",
    category: "Serum/Essence",
    description: "100% Centella Asiatica extract for soothing skin.",
    price: 2400,
    isNew: false,
    isBestSeller: true,
    stock: 30,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600",
    skinType: JSON.stringify(["All Skin Types"]),
    ingredients: JSON.stringify(["Centella Asiatica"])
  }
];

async function main() {
  console.log('🌱 Seeding Supabase Database...');
  for (const product of initialProducts) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }
  console.log('✅ Seeding Complete!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
