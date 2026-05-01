"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useProducts } from '../lib/ProductContext';
import styles from './HomeProductTabs.module.css';

export default function HomeProductTabs() {
  const [activeTab, setActiveTab] = useState('new');
  const { products } = useProducts();

  const newArrivals = Array.isArray(products) ? products.filter(p => p.isNew).slice(0, 4) : [];
  const bestSellers = Array.isArray(products) ? products.filter(p => p.isBestSeller).slice(0, 4) : [];

  const displayedProducts = activeTab === 'new' ? newArrivals : bestSellers;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabSwitcher}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'new' ? styles.active : ''}`}
          onClick={() => setActiveTab('new')}
        >
          New Arrivals
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'best' ? styles.active : ''}`}
          onClick={() => setActiveTab('best')}
        >
          Best Sellers
        </button>
      </div>

      <div className={styles.productGrid}>
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href="/shop" className={styles.viewAllBtn}>View All Products</Link>
      </div>
    </div>
  );
}
