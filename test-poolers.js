const { PrismaClient } = require('@prisma/client');

const clusters = ['aws-0', 'aws-1'];
const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'eu-central-1'
];

async function checkRegion(cluster, region) {
  const host = `${cluster}-${region}.pooler.supabase.com`;
  const url = `postgresql://postgres.ekogbzacmtwdjwbobeuj:Beauty%40bees12@${host}:6543/postgres?pgbouncer=true`;
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    console.log(`Checking ${host}...`);
    await prisma.$connect();
    await prisma.user.count();
    console.log(`\n✅ SUCCESS!`);
    console.log(`DATABASE_URL="${url}"`);
    process.exit(0);
  } catch(e) {
    if (!e.message.includes("Authentication failed")) {
       console.log(`  - Error: ${e.message.slice(0, 100)}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  console.log("Brute-forcing Supabase Pooler hosts...");
  for (const c of clusters) {
    for (const r of regions) {
      await checkRegion(c, r);
    }
  }
  console.log("\n❌ All known hosts failed. This usually means the password 'Beauty@bees12' is incorrect.");
}
run();
