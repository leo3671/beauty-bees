"use client";

import styles from './ShopByBrand.module.css';
import Link from 'next/link';

const brands = [
  { name: 'Anua', logo: '/images/brand_anua.png' },
  { name: 'Skin1004', logo: '/images/brand_skin1004.png' },
  { name: 'Haru Haru Wonder', logo: '/images/brand_haruharu.png' },
  { name: 'Cosrx', logo: '/images/brand_cosrx.png' },
  { name: 'Laneige', logo: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=200' },
  { name: 'Manyo', logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=200' }
];

export default function ShopByBrand() {
  return (
    <section className={`container ${styles.brandSection}`}>
      <div className={styles.header}>
        <span className={styles.tag}>COLLECTIONS</span>
        <h2>Shop by Brand</h2>
        <p>Premium Korean brands you know and love.</p>
      </div>
      
      <div className={styles.brandGrid}>
        {brands.map((brand) => (
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
