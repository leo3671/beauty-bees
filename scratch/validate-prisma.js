const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

console.log("Scanning codebase for duplicate PrismaClient instances...");
let issues = [];

walkDir(path.join(__dirname, '..'), (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    // Skip lib/prisma.js and scratch/test/seeding scripts
    if (
      filePath.includes('lib\\prisma.js') || 
      filePath.includes('lib/prisma.js') || 
      filePath.includes('scratch\\') || 
      filePath.includes('scratch/') ||
      filePath.includes('scripts\\') ||
      filePath.includes('scripts/') ||
      filePath.includes('test-db.js') ||
      filePath.includes('test-poolers.js')
    ) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('new PrismaClient(') || (content.includes('new PrismaClient') && !content.includes('import prisma from'))) {
      issues.push(filePath);
    }
  }
});

if (issues.length > 0) {
  console.error("\n❌ Found duplicate PrismaClient instantiations in the following files:");
  issues.forEach(i => console.error(`  - ${path.relative(path.join(__dirname, '..'), i)}`));
  process.exit(1);
} else {
  console.log("\n✅ Success: No duplicate PrismaClient instantiations found!");
  process.exit(0);
}
