const { PrismaClient } = require('@prisma/client');

async function main() {
  const url = "postgresql://postgres.ekogbzacmtwdjwbobeuj:Beauty%40bees12@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";
  console.log("Connecting to DIRECT_URL...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    console.log("Users found:", JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
