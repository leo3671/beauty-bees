const { PrismaClient } = require('@prisma/client');

const regions = [
  'aws-0-us-east-1',
  'aws-0-us-west-1',
  'aws-0-eu-central-1',
  'aws-0-eu-west-1',
  'aws-0-eu-west-2',
  'aws-0-ap-southeast-1',
  'aws-0-ap-south-1',
  'aws-0-ap-northeast-1',
  'aws-0-sa-east-1',
  'aws-0-ca-central-1'
];

async function checkRegion(region) {
  const url = `postgresql://postgres.ekogbzacmtwdjwbobeuj:Beauty%40bees12@${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.$connect();
    await prisma.user.count();
    console.log(`✅ SUCCESS IN REGION: ${region}`);
    console.log(`URL: ${url}`);
    process.exit(0);
  } catch(e) {
    // console.log(`Failed ${region}`);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  console.log("Testing regions...");
  for (const r of regions) {
    await checkRegion(r);
  }
  console.log("❌ All regions failed.");
}
run();
