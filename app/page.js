import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import HomeProductTabs from "../components/HomeProductTabs";
import ShopByCategory from "../components/ShopByCategory";
import Recommendations from "../components/Recommendations";
import ShopByBrand from "../components/ShopByBrand";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Fetch top 3 brands dynamically from DB
  let brands = [];
  try {
    const brandProducts = await prisma.product.findMany({
      select: { brand: true, image: true },
      distinct: ['brand'],
      take: 3
    });
    brands = brandProducts.map(p => ({ name: p.brand, img: p.image }));
  } catch (e) {
    console.error("Failed to fetch brands", e);
  }

  return (
    <div className={styles.page}>
      
      {/* ===== ANNOUNCEMENT BAR ===== */}
      <div className={styles.announcementBar}>
        <p>🌸 FREE SHIPPING on orders over Rs. 10,000 &nbsp;|&nbsp; 100% Authentic K-Beauty &nbsp;|&nbsp; Fast Delivery Across Nepal 🇳🇵</p>
      </div>

      {/* ===== HERO SLIDESHOW ===== */}
      <section className={styles.heroSlider}>
        <div className={styles.heroSlide}>
          <div className={styles.heroImageSide}>
            <Image 
              src="/images/hero_banner_secondary.png" 
              alt="K-Beauty Collection" 
              width={800} 
              height={600} 
              priority 
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </div>
          <div className={styles.heroTextSide}>
            <span className={styles.heroBadge}>NEW COLLECTION</span>
            <h1>Your Skin Deserves<br/>Korean Excellence</h1>
            <p>Discover our handpicked selection of premium K-Beauty products. From serums to sunscreens — everything your skin craves.</p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={styles.ctaPrimary}>Shop Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES BAR ===== */}
      <section className={styles.trustBar}>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>✈️</span>
          <div>
            <strong>Free Shipping</strong>
            <span>On orders over Rs. 10,000</span>
          </div>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>🔒</span>
          <div>
            <strong>100% Authentic</strong>
            <span>Directly from South Korea</span>
          </div>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>📦</span>
          <div>
            <strong>Fast Delivery</strong>
            <span>2-5 days across Nepal</span>
          </div>
        </div>
        <div className={styles.trustItem}>
          <span className={styles.trustIcon}>💖</span>
          <div>
            <strong>Expert Curation</strong>
            <span>Hand-picked for your skin</span>
          </div>
        </div>
      </section>

      {/* ===== RECOMMENDED FOR YOU ===== */}
      <Recommendations />

      {/* ===== SHOP BY BRAND ===== */}
      <ShopByBrand />

      {/* ===== SHOP BY CATEGORY ===== */}
      <ShopByCategory />

      {/* ===== BEST SELLERS / NEW ARRIVALS TABS ===== */}
      <section className={`container ${styles.sectionBlock}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>CURATED</span>
          <h2>Our Collections</h2>
          <p className={styles.sectionSub}>Explore our best sellers and newest arrivals</p>
        </div>
        <HomeProductTabs />
      </section>

      {/* ===== FULL WIDTH IMAGE BANNER ===== */}
      <section className={styles.fullBanner}>
        <img src="/images/hero_banner_main.png" alt="Beauty Bees Cosmetics Collection" className={styles.fullBannerImg} />
        <div className={styles.fullBannerOverlay}>
          <h2>Science Meets Beauty</h2>
          <p>Every product in our store is backed by Korean dermatological research and loved by millions worldwide. We bring you the latest innovations in skincare technology from the heart of Seoul.</p>
          <Link href="/shop" className={styles.ctaWhite}>Explore All Products</Link>
        </div>
      </section>

      {/* ===== WHY BEAUTY BEES (Icon Grid) ===== */}
      <section className={styles.whySection}>
        <div className={`container`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>WHY US</span>
            <h2>The Beauty Bees Cosmetics Difference</h2>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🇰🇷</div>
              <h3>Direct from Korea</h3>
              <p>We source directly from official Korean distributors. Zero middlemen, zero counterfeits. 100% authenticity guaranteed.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🧪</div>
              <h3>Dermatologist Tested</h3>
              <p>Every brand in our catalog is clinically tested and approved by Korean dermatologists for sensitive skin.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🌿</div>
              <h3>Clean Ingredients</h3>
              <p>No parabens, no sulfates, no animal testing. Just pure, effective skincare derived from nature.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>💬</div>
              <h3>Expert Support</h3>
              <p>Not sure what to buy? Our skincare experts and AI assistant Bee help you find the perfect routine for your skin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SIGNUP ===== */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Join the Beauty Bees Cosmetics Family</h2>
          <p>Subscribe for exclusive drops, skincare tips, and members-only discounts.</p>
          <div className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email address" className={styles.newsletterInput} />
            <button className={styles.newsletterBtn}>Subscribe</button>
          </div>
          <small className={styles.newsletterNote}>No spam. Unsubscribe anytime. 🐝</small>
        </div>
      </section>
    </div>
  );
}
