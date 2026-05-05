const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Production Sanitation...');

  // 1. CLEAR ORDERS & TRANSACTIONS
  console.log('📦 Clearing Order & Transaction History...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  console.log('✅ Orders cleared.');

  // 2. CLEAR CHAT SESSIONS
  console.log('💬 Clearing Chat History...');
  await prisma.chatMessage.deleteMany({});
  await prisma.chatSession.deleteMany({});
  console.log('✅ Chats cleared.');

  // 3. REMOVE NON-ADMIN USERS
  console.log('👥 Removing Test Accounts...');
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        email: 'admin@beautybees.com'
      }
    },
    select: { id: true, email: true }
  });

  console.log(`Found ${users.length} non-admin accounts to delete.`);
  for (const user of users) {
    await prisma.user.delete({ where: { id: user.id } });
    console.log(`- Deleted: ${user.email}`);
  }
  console.log('✅ User sanitation complete.');

  // 4. CLEAR REVIEWS
  console.log('⭐ Clearing Product Reviews...');
  await prisma.review.deleteMany({});
  console.log('✅ Reviews cleared.');

  // 5. VERIFICATION
  const userCount = await prisma.user.count();
  const orderCount = await prisma.order.count();
  
  console.log('\n--- PRODUCTION READINESS REPORT ---');
  console.log(`Total Users: ${userCount} (Should be 1 - Admin)`);
  console.log(`Total Orders: ${orderCount} (Should be 0)`);
  console.log('------------------------------------\n');

  console.log('✨ Beauty Bees Cosmetics is now in Production-Ready state.');
}

main()
  .catch(e => console.error('❌ Sanitation Error:', e))
  .finally(async () => await prisma.$disconnect());
