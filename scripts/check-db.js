const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log("Testing database connection...");
    const userCount = await prisma.user.count();
    console.log(`Connection successful! Total users: ${userCount}`);
    
    console.log("Checking SiteSetting model...");
    const settingCount = await prisma.siteSetting.count();
    console.log(`SiteSetting model exists. Total settings: ${settingCount}`);
  } catch (e) {
    console.error("Database check failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
