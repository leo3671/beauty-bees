const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@beautybees.com';
  const password = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    },
    create: {
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      phone: '9800000000'
    }
  });

  console.log('✅ Admin password has been force-reset to: AdminPassword123!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
