const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@beautybees.com';
  const password = 'AdminPassword123!';
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('❌ User not found');
    return;
  }
  
  console.log('Found user:', user.email);
  const isValid = await bcrypt.compare(password, user.password);
  console.log('Is password valid (using bcryptjs)?', isValid);
  
  if (!isValid) {
    console.log('Re-hashing password with 10 rounds instead of 12...');
    const newHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: newHash }
    });
    const reTest = await bcrypt.compare(password, newHash);
    console.log('Re-test after update:', reTest);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
