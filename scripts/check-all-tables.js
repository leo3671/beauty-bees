const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = [
    'user', 'product', 'review', 'order', 'orderItem', 
    'verificationToken', 'discountVoucher', 'chatSession', 
    'chatMessage', 'shippingZone'
  ];
  
  console.log('--- Database Table Check ---');
  for (const table of tables) {
    try {
      const count = await prisma[table].count();
      console.log(`✅ ${table}: ${count} records`);
    } catch (e) {
      console.log(`❌ ${table}: FAILED (${e.message.split('\n')[0]})`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
