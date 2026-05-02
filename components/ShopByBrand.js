"use client";

import styles from './ShopByBrand.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ShopByBrand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        if (data.length > 0) {
          setBrands(data);
        } else {
          // Default fallback if DB is empty
          setBrands([
            { name: 'Anua', logo: '/images/brand_anua.png' },
            { name: 'Skin1004', logo: '/images/brand_skin1004.png' },
            { name: 'Haru Haru Wonder', logo: '/images/brand_haruharu.png' },
            { name: 'Cosrx', logo: '/images/brand_cosrx.png' },
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch brands", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return null;
  return (
    <section className={`container ${styles.brandSection}`}>
      <div className={styles.header}>
        <span className={styles.tag}>COLLECTIONS</span>
        <h2>Shop by Brand</h2>
        <p>Premium Korean brands you know and love.</p>
      </div>
      
      <div className={styles.brandGrid}>
        {Array.isArray(brands) && brands.map((brand) => (
          <Link 
            key={brand.name} 
            href={`/shop?brand=${brand.name}`}
            className={styles.brandCard}
          >
            <div className={styles.logoWrapper}>
              <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
            </div>
            <span className={styles.brandName}>{brand.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
