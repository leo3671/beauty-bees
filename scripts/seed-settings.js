const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Site Settings...');
  
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {
      logoUrl: '/logo_new.png',
      siteName: 'Beauty Bees'
    },
    create: {
      id: 'global',
      logoUrl: '/logo_new.png',
      siteName: 'Beauty Bees'
    },
  });

  console.log('Site settings seeded:', settings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
