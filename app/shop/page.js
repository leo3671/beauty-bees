"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import { categories } from '../../lib/data';
import styles from './page.module.css';
import { Suspense } from 'react';
import { useProducts } from '../../lib/ProductContext';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialBrand = searchParams.get('brand');
  const searchQuery = searchParams.get('search') || '';
  
  const [activeCategory, setActiveCategory] = useState(initialBrand || 'All');
  const [skinType, setSkinType] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { products, loading } = useProducts();

  // Sync activeCategory if URL changes
  useEffect(() => {
    if (initialBrand) setActiveCategory(initialBrand);
  }, [initialBrand]);

  const filteredProducts = Array.isArray(products) ? products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory || p.brand === activeCategory;
    const matchesSearch = searchQuery === '' || 
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let pSkinTypes = [];
    try { pSkinTypes = JSON.parse(p.skinType || '[]'); } catch(e) {}
    const matchesSkinType = skinType === 'All' || pSkinTypes.includes(skinType);
    
    return matchesCategory && matchesSearch && matchesSkinType;
  }) : [];

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  if (loading) return (
    <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
      <div className={styles.spinner}></div>
      <p>Loading curated selection...</p>
    </div>
  );

  return (
    <div className={`container ${styles.shopPage}`}>
      <div className={styles.header}>
        <h1>{searchQuery ? `Search Results for "${searchQuery}"` : activeCategory === 'All' ? 'All Products' : activeCategory}</h1>
        <p>Curated Korean beauty for every skin type and concern.</p>
      </div>

      <button className={styles.mobileFilterToggle} onClick={() => setShowMobileFilters(!showMobileFilters)}>
        {showMobileFilters ? '✕ Close Filters' : '🔍 Show Filters & Sorting'}
      </button>

      <div className={styles.layout}>
        <aside className={`${styles.sidebar} ${showMobileFilters ? styles.mobileVisible : ''}`}>
          <div className={styles.filterGroup}>
            <h3>Categories & Brands</h3>
            <ul className={styles.categoryList}>
              {categories.map((category) => (
                <li key={category}>
                  <button 
                    className={category === activeCategory ? styles.active : ''}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
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

        <div className={styles.productGrid}>
          {sortedProducts.length > 0 ? (
            sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No products match your filters.</p>
              <button onClick={() => { setActiveCategory('All'); setSkinType('All'); setSortBy('Newest'); setShowMobileFilters(false); }} className={styles.resetBtn}>Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
