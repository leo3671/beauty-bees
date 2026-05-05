const { PrismaClient } = require('@prisma/client');

async function main() {
  const url = "postgresql://postgres.ekogbzacmtwdjwbobeuj:Beauty%40bees12%21@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  console.log("Connecting with Beauty@bees12! ...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    const userCount = await prisma.user.count();
    console.log("Success! Found users:", userCount);
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
