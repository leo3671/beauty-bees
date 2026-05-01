import Link from 'next/link';
import styles from './HeroSpotlight.module.css';

export default function HeroSpotlight() {
  return (
    <div className={styles.spotlightContainer}>
      <div className={styles.spotlightCard}>
        <div className={styles.spotlightImageWrapper}>
          <img src="/images/skin1004_ampoule.jpg" alt="Skin1004 Centella Ampoule" />
        </div>
        <div className={styles.spotlightContent}>
          <div className={styles.badge}>Global Best Seller</div>
          <h3>Skin1004 Madagascar Centella Asiatica Ampoule</h3>
          <p>
            Experience the miracle of 100% pure Centella Asiatica extract from Madagascar. 
            Instantly soothes inflamed skin and provides deep, lasting hydration. A viral sensation worldwide.
          </p>
          <div className={styles.priceContainer}>
            <span className={styles.price}>रु 2,300</span>
          </div>
          <Link href="/shop" className={styles.shopBtn}>
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
