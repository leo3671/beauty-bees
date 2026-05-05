const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Database Backup...');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const data = {
    products: await prisma.product.findMany(),
    brands: await prisma.brand.findMany(),
    users: await prisma.user.findMany(),
    orders: await prisma.order.findMany({ include: { items: true } }),
    reviews: await prisma.review.findMany()
  };

  const filePath = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`✅ Backup complete: ${filePath}`);
}

main()
  .catch(e => console.error('❌ Backup failed:', e))
  .finally(async () => await prisma.$disconnect());
