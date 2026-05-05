const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('BeautyBeesAdmin2025!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@beautybees.com' },
    update: { password: hashedPassword, role: 'admin', isVerified: true },
    create: {
      email: 'admin@beautybees.com',
      name: 'Super Admin',
      phone: '9800000000',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    }
  });
  console.log('✅ Admin password reset to: BeautyBeesAdmin2025!');
}

main().finally(() => prisma.$disconnect());
