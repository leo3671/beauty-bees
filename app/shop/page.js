"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { Suspense } from 'react';
import { useProducts } from '../../lib/ProductContext';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const searchQuery = searchParams.get('search') || '';
  
  const [activeFilter, setActiveFilter] = useState(initialBrand || 'All');
  const [skinType, setSkinType] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { products, loading } = useProducts();

  const brandRefs = useRef({});

  // Sync activeFilter if URL changes
  useEffect(() => {
    if (initialBrand) {
      setActiveFilter(initialBrand);
      scrollToBrand(initialBrand);
    }
  }, [initialBrand]);

  const scrollToBrand = (brand) => {
    if (brandRefs.current[brand]) {
      brandRefs.current[brand].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.category === activeFilter || p.brand === activeFilter;
    const matchesSearch = searchQuery === '' || 
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let pSkinTypes = [];
    try { pSkinTypes = JSON.parse(p.skinType || '[]'); } catch(e) {}
    const matchesSkinType = skinType === 'All' || pSkinTypes.includes(skinType);
    
    return matchesFilter && matchesSearch && matchesSkinType;
  }) : [];

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // Group by Brand
  const brandsOrder = ['Anua', 'Skin1004', 'Haru Haru Wonder'];
  const groupedProducts = sortedProducts.reduce((acc, product) => {
    const brand = product.brand || 'Other';
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(product);
    return acc;
  }, {});

  const displayedBrands = Object.keys(groupedProducts).sort((a, b) => {
    const indexA = brandsOrder.indexOf(a);
    const indexB = brandsOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  const categories = ['All', 'Cleansers', 'Toners', 'Serums', 'Moisturizers', 'Sunscreen'];
  const brands = ['Anua', 'Skin1004', 'Haru Haru Wonder'];

  if (loading) return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="inline-block w-8 h-8 border-4 border-bb-pink border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Loading curated selection...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-[3px] text-bb-pink mb-2 block">EXPERTLY CURATED</span>
        <h1 className="font-heading text-3xl font-bold text-bb-heading mb-3">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Premium Korean skincare grouped by brand for your convenience.
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <button 
        className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-bb-border/80 rounded-xl font-semibold text-bb-text mb-6 shadow-sm hover:bg-bb-bg transition-colors"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
        Filter & Sort
      </button>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Sidebar Filter Control */}
        <aside className={cn(
          "w-full lg:w-64 flex-shrink-0 flex flex-col gap-6",
          // Mobile state overrides
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-[999] max-lg:bg-white max-lg:p-6 max-lg:w-[280px] max-lg:shadow-[10px_0_30px_rgba(0,0,0,0.1)] max-lg:transition-transform max-lg:duration-300 max-lg:transform",
          showMobileFilters ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        )}>
          {/* Brand Filter */}
          <div className="border-b border-bb-border/20 pb-5">
            <h3 className="font-heading font-bold text-bb-heading text-sm uppercase tracking-wider mb-3">Brands</h3>
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
              {brands.map((brand) => (
                <li key={brand}>
                  <button 
                    className={cn(
                      "w-full text-left py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors bg-transparent border-none cursor-pointer",
                      brand === activeFilter 
                        ? "bg-bb-pink text-white" 
                        : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
                    )}
                    onClick={() => {
                      setActiveFilter(brand);
                      scrollToBrand(brand);
                      setShowMobileFilters(false);
                    }}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Filter */}
          <div className="border-b border-bb-border/20 pb-5">
            <h3 className="font-heading font-bold text-bb-heading text-sm uppercase tracking-wider mb-3">Categories</h3>
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
              {categories.map((cat) => (
                <li key={cat}>
                  <button 
                    className={cn(
                      "w-full text-left py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors bg-transparent border-none cursor-pointer",
                      cat === activeFilter 
                        ? "bg-bb-pink text-white" 
                        : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
                    )}
                    onClick={() => {
                      setActiveFilter(cat);
                      setShowMobileFilters(false);
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Skin Type Filter */}
          <div className="border-b border-bb-border/20 pb-5">
            <h3 className="font-heading font-bold text-bb-heading text-sm uppercase tracking-wider mb-3">Skin Type</h3>
            <select 
              value={skinType} 
              onChange={(e) => setSkinType(e.target.value)} 
              className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-3 py-2 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
            >
              <option value="All">All Skin Types</option>
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Combination">Combination</option>
            </select>
          </div>

          {/* Sort Control */}
          <div>
            <h3 className="font-heading font-bold text-bb-heading text-sm uppercase tracking-wider mb-3">Sort By</h3>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-3 py-2 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
            >
              <option value="Newest">Newest First</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {displayedBrands.length > 0 ? (
            displayedBrands.map(brandName => (
              <section 
                key={brandName} 
                className="mb-12 scroll-mt-24" 
                ref={el => brandRefs.current[brandName] = el}
              >
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading text-2xl font-bold text-bb-heading whitespace-nowrap">{brandName}</h2>
                  <div className="flex-1 h-[2px] bg-bb-border/30"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {groupedProducts[brandName].map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-20 px-4 bg-white border border-bb-border/30 rounded-2xl">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="font-heading text-xl font-bold text-bb-heading mb-2">
                {activeFilter !== 'All' ? `${activeFilter} Collection Coming Soon` : 'No products found'}
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                {activeFilter !== 'All' 
                  ? `We're currently hand-picking the best of ${activeFilter} for our Nepal collection. Check back soon for authentic K-beauty arrivals!`
                  : 'We couldn\'t find any products matching your current filters.'}
              </p>
              <button 
                onClick={() => { setActiveFilter('All'); setSkinType('All'); setSortBy('Newest'); }} 
                className="bg-bb-heading text-white font-bold text-sm px-6 py-2.5 rounded-xl border-none cursor-pointer hover:bg-bb-text transition-colors"
              >
                Back to Full Collection
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Sidebar Backdrop */}
      {showMobileFilters && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]" 
          onClick={() => setShowMobileFilters(false)} 
        />
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-32 text-center text-slate-500 font-medium">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
