const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'global' },
    update: {
      logoUrl: '/logo_new.png'
    },
    create: {
      id: 'global',
      logoUrl: '/logo_new.png',
      siteName: 'Beauty Bees'
    }
  });
  console.log('Site settings updated in DB:', settings);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
