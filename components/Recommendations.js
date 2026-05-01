"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../lib/ProductContext';
import styles from './Recommendations.module.css';

export default function Recommendations() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { products } = useProducts();
  const [historyExists, setHistoryExists] = useState(false);

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) return;

    try {
      const historyStr = localStorage.getItem('beautyBees_history');
      if (historyStr) {
        const history = JSON.parse(historyStr);
        
        if (history.categories && (history.categories.length > 0 || history.brands.length > 0)) {
          setHistoryExists(true);
          
          let recs = products.filter(p => 
            (history.categories.includes(p.category) || history.brands.includes(p.brand)) &&
            !history.productIds.includes(p.id)
          );

          if (recs.length < 4) {
            const extra = products.filter(p => 
              p.isBestSeller && !history.productIds.includes(p.id) && !recs.find(r => r.id === p.id)
            );
            recs = [...recs, ...extra].slice(0, 4);
          } else {
            recs = recs.sort(() => 0.5 - Math.random()).slice(0, 4);
          }
          
          setRecommendedProducts(recs);
          return;
        }
      }
    } catch (e) {
      console.error("Error loading recommendations", e);
    }
    
    // No history, no recommendations
    setHistoryExists(false);
  }, [products]);

  if (!historyExists || recommendedProducts.length === 0) {
    return null; // Don't render anything if no history
  }

  return (
    <section className={`container ${styles.recSection}`}>
      <div className={styles.sectionHeader}>
        <h2>Recommended For You</h2>
        <p>Based on your recent purchases</p>
      </div>
      <div className={styles.productGrid}>
        {recommendedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
