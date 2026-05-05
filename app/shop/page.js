"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import styles from './page.module.css';
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
    <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
      <div className={styles.spinner}></div>
      <p>Loading curated selection...</p>
    </div>
  );

  return (
    <div className={`container ${styles.shopPage}`}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>EXPERTLY CURATED</span>
        <h1>{searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}</h1>
        <p>Premium Korean skincare grouped by brand for your convenience.</p>
      </div>

      <button className={styles.mobileFilterToggle} onClick={() => setShowMobileFilters(!showMobileFilters)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
        Filter & Sort
      </button>

      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${showMobileFilters ? styles.mobileVisible : ''}`}>
          <div className={styles.filterGroup}>
            <h3>Brands</h3>
            <ul className={styles.categoryList}>
              {brands.map((brand) => (
                <li key={brand}>
                  <button 
                    className={brand === activeFilter ? styles.active : ''}
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

          <div className={styles.filterGroup}>
            <h3>Categories</h3>
            <ul className={styles.categoryList}>
              {categories.map((cat) => (
                <li key={cat}>
                  <button 
                    className={cat === activeFilter ? styles.active : ''}
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

          <div className={styles.filterGroup}>
            <h3>Skin Type</h3>
            <select value={skinType} onChange={(e) => setSkinType(e.target.value)} className={styles.selectFilter}>
              <option value="All">All Skin Types</option>
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Sensitive">Sensitive</option>
              <option value="Combination">Combination</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <h3>Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.selectFilter}>
              <option value="Newest">Newest First</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <div className={styles.mainContent}>
          {displayedBrands.length > 0 ? (
            displayedBrands.map(brandName => (
              <section 
                key={brandName} 
                className={styles.brandSection} 
                ref={el => brandRefs.current[brandName] = el}
              >
                <div className={styles.brandHeader}>
                  <h2>{brandName}</h2>
                  <div className={styles.brandDivider}></div>
                </div>
                <div className={styles.productGrid}>
                  {groupedProducts[brandName].map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No products match your filters.</p>
              <button onClick={() => { setActiveFilter('All'); setSkinType('All'); setSortBy('Newest'); }} className={styles.resetBtn}>Reset Filters</button>
            </div>
          )}
        </div>
      </div>
      {showMobileFilters && <div className={styles.backdrop} onClick={() => setShowMobileFilters(false)} />}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
