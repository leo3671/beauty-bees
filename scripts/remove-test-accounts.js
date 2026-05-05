const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Searching for test accounts...');

  const testPatterns = [
    { email: { endsWith: '@test.com' } },
    { email: { endsWith: '@example.com' } },
    { name: { contains: 'Test', mode: 'insensitive' } }
  ];

  const testUsers = await prisma.user.findMany({
    where: {
      OR: testPatterns
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  });

  if (testUsers.length === 0) {
    console.log('✅ No test accounts found.');
    return;
  }

  console.log(`Found ${testUsers.length} test accounts:`);
  testUsers.forEach(u => console.log(`- ${u.name} (${u.email})`));

  console.log('\n🗑️ Deleting test accounts...');
  
  for (const user of testUsers) {
    try {
      // Delete associated verification tokens first due to FK constraints if any
      // In this schema, VerificationToken doesn't have a direct FK to User, but it might be used
      
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.log(`✅ Deleted: ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to delete ${user.email}:`, err.message);
    }
  }

  console.log('\n✨ Cleanup complete!');
}

main()
  .catch(e => {
    console.error('❌ Error during cleanup:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
