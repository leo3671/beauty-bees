const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging existing product data...');
  
  // Delete reviews first to avoid foreign key constraints
  await prisma.review.deleteMany({});
  // Delete products
  await prisma.product.deleteMany({});
  // Delete brands
  await prisma.brand.deleteMany({});
  
  console.log('🌱 Seeding New Premium Catalog...');

  const products = [
    // ANUA
    {
      name: 'Heartleaf Pore Control Cleansing Oil (200ml)',
      brand: 'Anua',
      category: 'Cleansers',
      price: 3100,
      description: 'Anua Heartleaf Pore Control Cleansing Oil is a deep cleansing oil that removes impurities, sunscreen, and waterproof makeup while soothing the skin with heartleaf extract.',
      isNew: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types', 'Sensitive', 'Acne-Prone'],
      ingredients: ['Heartleaf Extract', 'Jojoba Oil', 'Olive Oil']
    },
    {
      name: 'Heartleaf Quercetinol Pore Deep Cleansing Foam (150ml)',
      brand: 'Anua',
      category: 'Cleansers',
      price: 1900,
      description: 'A deep cleansing foam that effectively cleanses pores and controls excess sebum with Quercetinol.',
      isNew: false,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Oily', 'Combination'],
      ingredients: ['Quercetinol', 'Heartleaf Extract']
    },
    {
      name: 'Heartleaf Pore Control Cleansing Oil Mild (200ml)',
      brand: 'Anua',
      category: 'Cleansers',
      price: 3100,
      description: 'A mild version of the best-selling cleansing oil, perfect for sensitive skin.',
      isNew: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Sensitive', 'Dry'],
      ingredients: ['Heartleaf Extract', 'Sunflower Seed Oil']
    },
    {
      name: 'Heartleaf 77% Soothing Toner (250ml)',
      brand: 'Anua',
      category: 'Toners',
      price: 3100,
      description: 'A highly soothing toner containing 77% Heartleaf extract to calm irritated skin and provide hydration.',
      isBestSeller: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Sensitive', 'All Skin Types'],
      ingredients: ['Heartleaf Extract', 'Centella Asiatica']
    },
    {
      name: 'Rice 70 Glow Milky Toner (250ml)',
      brand: 'Anua',
      category: 'Toners',
      price: 3100,
      description: 'Infused with 70% Rice Bran Water, this toner brightens and hydrates for a milky glow.',
      isNew: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Dry', 'Dull'],
      ingredients: ['Rice Bran Water', 'Niacinamide']
    },
    {
      name: 'Niacinamide 10% TXA 4 Serum (30ml)',
      brand: 'Anua',
      category: 'Serums',
      price: 3300,
      description: 'A potent serum with 10% Niacinamide and 4% TXA to target dark spots and uneven skin tone.',
      isNew: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Niacinamide', 'TXA', 'Hyaluronic Acid']
    },
    {
      name: '7 Rice Ceramide Hydrating Barrier Serum (50ml)',
      brand: 'Anua',
      category: 'Serums',
      price: 3150,
      description: 'Strengthens skin barrier with rice-derived ceramides and deep hydration.',
      isNew: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Dry', 'Sensitive'],
      ingredients: ['Rice Extract', 'Ceramides']
    },
    {
      name: 'Heartleaf 70 Daily Lotion',
      brand: 'Anua',
      category: 'Moisturizers',
      price: 3200,
      description: 'A lightweight daily lotion with 70% Heartleaf extract for soothing hydration.',
      isNew: false,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Combination', 'Sensitive'],
      ingredients: ['Heartleaf Extract', 'Hyaluronic Acid']
    },

    // SKIN1004
    {
      name: 'Madagascar Centella Tone Brightening Capsule Ampoule (30ml)',
      brand: 'Skin1004',
      category: 'Serums',
      price: 1300,
      description: 'A brightening ampoule with Madagascar Centella and brightening capsules.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Dull', 'All Skin Types'],
      ingredients: ['Centella Asiatica', 'Niacinamide', 'Madecassoside']
    },
    {
      name: 'Madagascar Centella Tone Brightening Capsule Ampoule (50ml)',
      brand: 'Skin1004',
      category: 'Serums',
      price: 2300,
      description: 'A brightening ampoule with Madagascar Centella and brightening capsules.',
      isBestSeller: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Dull', 'All Skin Types'],
      ingredients: ['Centella Asiatica', 'Niacinamide', 'Madecassoside']
    },
    {
      name: 'Madagascar Centella Tone Brightening Capsule Ampoule (100ml)',
      brand: 'Skin1004',
      category: 'Serums',
      price: 3100,
      description: 'A brightening ampoule with Madagascar Centella and brightening capsules.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Dull', 'All Skin Types'],
      ingredients: ['Centella Asiatica', 'Niacinamide', 'Madecassoside']
    },
    {
      name: 'Madagascar Centella Poremizing Ampoule (50ml)',
      brand: 'Skin1004',
      category: 'Serums',
      price: 2300,
      description: 'Helps tighten pores and improve skin elasticity with Pink Himalayan Salt.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Oily', 'Large Pores'],
      ingredients: ['Centella Asiatica', 'Pink Himalayan Salt']
    },
    {
      name: 'Madagascar Centella Probio-Cica Ampoule (50ml)',
      brand: 'Skin1004',
      category: 'Serums',
      price: 2300,
      description: 'A fermented Centella ampoule for intensive barrier repair.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Dry', 'Damaged Barrier'],
      ingredients: ['Fermented Centella', 'Probiotics']
    },
    {
      name: 'Madagascar Centella Asiatica Ampoule (55ml)',
      brand: 'Skin1004',
      category: 'Serums',
      price: 2300,
      description: '100% Centella Asiatica extract from Madagascar to soothe and hydrate.',
      isBestSeller: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types', 'Sensitive'],
      ingredients: ['Centella Asiatica Extract']
    },
    {
      name: 'Madagascar Centella Hyalu-Cica Water-fit Sun Serum (50ml)',
      brand: 'Skin1004',
      category: 'Sunscreen',
      price: 2300,
      description: 'A lightweight chemical sunscreen with a serum-like texture and high hydration.',
      isBestSeller: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Centella Asiatica', 'Hyaluronic Acid']
    },
    {
      name: 'Madagascar Centella Hyalu-Cica Silky Fit Sun Stick (7g)',
      brand: 'Skin1004',
      category: 'Sunscreen',
      price: 1300,
      description: 'A convenient sun stick for easy reapplication with a silky finish.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types', 'Oily'],
      ingredients: ['Centella Asiatica', 'Hyaluronic Acid']
    },
    {
      name: 'Madagascar Centella Light Cleansing Oil (200ml)',
      brand: 'Skin1004',
      category: 'Cleansers',
      price: 2900,
      description: 'A lightweight cleansing oil that effectively removes makeup and impurities.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Centella Oil', 'Sunflower Seed Oil']
    },
    {
      name: 'Madagascar Centella Ampoule Foam (125ml)',
      brand: 'Skin1004',
      category: 'Cleansers',
      price: 1800,
      description: 'A mild cleansing foam infused with Centella ampoule for deep cleaning without dryness.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Centella Extract']
    },
    {
      name: 'Madagascar Centella Cream (75ml)',
      brand: 'Skin1004',
      category: 'Moisturizers',
      price: 2600,
      description: 'A moisturizing cream that calms skin and locks in moisture.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Centella Extract', 'Squalane']
    },

    // HARU HARU WONDER
    {
      name: 'Black Rice Probiotics Barrier Essence (120ml)',
      brand: 'Haru Haru Wonder',
      category: 'Serums',
      price: 3000,
      description: 'An essence-serum blend with black rice and probiotics for barrier protection.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Black Rice Extract', 'Probiotics']
    },
    {
      name: '4% TXA Serum Unscented (30ml)',
      brand: 'Haru Haru Wonder',
      category: 'Serums',
      price: 2900,
      description: 'A potent serum for hyperpigmentation with 4% TXA, fragrance-free.',
      isNew: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['TXA', 'Niacinamide']
    },
    {
      name: 'Black Rice Hyaluronic Toner (Fragrance-Free) (150ml)',
      brand: 'Haru Haru Wonder',
      category: 'Toners',
      price: 2200,
      description: 'A fragrance-free version of the popular black rice toner for deep hydration.',
      isBestSeller: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['Sensitive', 'All Skin Types'],
      ingredients: ['Black Rice Extract', 'Hyaluronic Acid']
    },
    {
      name: 'Moisture 5.5 Soft Cleansing Gel Unscented (100ml)',
      brand: 'Haru Haru Wonder',
      category: 'Cleansers',
      price: 1800,
      description: 'A gentle pH-balanced cleansing gel, fragrance-free.',
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types', 'Sensitive'],
      ingredients: ['Black Rice', 'Soapberry']
    },
    {
      name: 'Moisture Airyfit Daily Sunscreen SPF 50+ (50ml)',
      brand: 'Haru Haru Wonder',
      category: 'Sunscreen',
      price: 2300,
      description: 'A lightweight, airy sunscreen with a velvet finish, no white cast.',
      isBestSeller: true,
      image: '/logo_fixed.png',
      stock: 50,
      skinType: ['All Skin Types'],
      ingredients: ['Black Rice Oil', 'Hyaluronic Acid']
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        skinType: JSON.stringify(p.skinType),
        ingredients: JSON.stringify(p.ingredients)
      }
    });
  }

  // Seed Brands
  const brands = [
    { name: 'Anua', logo: '/images/brand_anua.png' },
    { name: 'Skin1004', logo: '/images/brand_skin1004.png' },
    { name: 'Haru Haru Wonder', logo: '/images/brand_haruharu.png' }
  ];

  for (const b of brands) {
    await prisma.brand.create({
      data: b
    });
  }

  console.log(`✅ Reset Complete! Created ${products.length} products and ${brands.length} brands.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
