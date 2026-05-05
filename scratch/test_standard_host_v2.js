const { PrismaClient } = require('@prisma/client');

async function main() {
  const url = "postgresql://postgres:Beauty%40bees12@db.ekogbzacmtwdjwbobeuj.supabase.co:5432/postgres";
  console.log("Connecting to STANDARD_HOST with username 'postgres'...");
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
