/**
 * Beauty Bees Cosmetics - Image Optimization and Compression Tool
 * 
 * This script optimizes local product images in `public/images` and provides 
 * automation workflow advice for Supabase storage assets to keep footprint < 1GB.
 * 
 * Recommended execution prerequisites:
 * 1. Install sharp (fast image compression library): `npm install sharp --no-save`
 * 2. Run this script: `node scripts/compress-images.js`
 */

const fs = require('fs');
const path = require('path');

// 1. Workflow Advice for Supabase Storage Optimization
console.log(`
======================================================================
🐝 SUPABASE STORAGE OPTIMIZATION WORKFLOW ADVICE (Free-tier < 1GB Limit)
======================================================================
1. Convert to WebP: Always upload images in .webp format (average 60-80% smaller than JPEG/PNG).
2. Constrain Resolution: Crop and resize product photos to max 800x800px. High resolution is redundant for ecommerce thumbnails.
3. Quality setting: Set compression quality to 75-80. Loss in visual clarity is imperceptible to humans.
4. Auto-Compress script: Install 'sharp' locally and execute the automated script below.
======================================================================
`);

const targetDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(targetDir)) {
  console.log(`❌ Target directory public/images not found at: ${targetDir}`);
  process.exit(1);
}

const files = fs.readdirSync(targetDir);
console.log(`📁 Scanning directory: public/images/`);
console.log(`Found ${files.length} files to analyze.\n`);

let totalOriginalSize = 0;
const images = [];

files.forEach(file => {
  const filePath = path.join(targetDir, file);
  const stats = fs.statSync(filePath);
  const ext = path.extname(file).toLowerCase();
  
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    totalOriginalSize += stats.size;
    images.push({
      name: file,
      path: filePath,
      size: stats.size
    });
  }
});

console.log(`📊 Current total image storage: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);

// Try loading sharp for compression
try {
  const sharp = require('sharp');
  console.log('⚡ "sharp" detected! Starting batch compression to WebP...');
  
  images.forEach(async (img) => {
    const ext = path.extname(img.name);
    const baseName = path.basename(img.name, ext);
    const newName = `${baseName}.webp`;
    const outputPath = path.join(targetDir, newName);
    
    try {
      await sharp(img.path)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputPath);
        
      const outStats = fs.statSync(outputPath);
      const savings = ((img.size - outStats.size) / img.size * 100).toFixed(1);
      
      console.log(`✅ Optimized ${img.name} -> ${newName}`);
      console.log(`   Size: ${(img.size/1024).toFixed(1)}KB -> ${(outStats.size/1024).toFixed(1)}KB (Saved ${savings}%)`);
      
      // Delete old file if it wasn't already a webp
      if (ext !== '.webp') {
        fs.unlinkSync(img.path);
        console.log(`   Deleted original unoptimized: ${img.name}`);
      }
    } catch (err) {
      console.error(`❌ Failed to compress ${img.name}:`, err.message);
    }
  });
  
} catch (e) {
  console.log(`
💡 Note: To perform auto-compression, please run:
   npm install sharp
   node scripts/compress-images.js

This will automatically resize all local images to max 800px and transcode to optimized WebP.
`);
}
