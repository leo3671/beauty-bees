const { PrismaClient } = require('@prisma/client');

async function test(region) {
  const url = `postgresql://postgres.ekogbzacmtwdjwbobeuj:Beauty%40bees12@${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  console.log(`Testing ${region}...`);
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.$connect();
    const count = await prisma.user.count();
    console.log(`✅ Success in ${region}! Count: ${count}`);
    return true;
  } catch (e) {
    console.log(`❌ Failed ${region}: ${e.message.split('\n')[0]}`);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const commonRegions = ['aws-0-ap-southeast-1', 'aws-0-us-east-1', 'aws-0-eu-central-1'];
  for (const r of commonRegions) {
    if (await test(r)) break;
  }
}

main();
