import Link from "next/link";
import styles from "./page.module.css";
import HomeProductTabs from "../components/HomeProductTabs";
import ShopByCategory from "../components/ShopByCategory";
import Recommendations from "../components/Recommendations";

export default function Home() {
  return (
    <div className={styles.page}>
      
      {/* ===== ANNOUNCEMENT BAR ===== */}
      <div className={styles.announcementBar}>
        <p>🌸 FREE SHIPPING on orders over Rs. 5,000 &nbsp;|&nbsp; 100% Authentic K-Beauty &nbsp;|&nbsp; Fast Delivery Across Nepal 🇳🇵</p>
      </div>

      {/* ===== HERO SLIDESHOW ===== */}
      <section className={styles.heroSlider}>
        <div className={styles.heroSlide}>
          <div className={styles.heroImageSide}>
            <img src="/images/hero_banner_secondary.png" alt="K-Beauty Collection" />
          </div>
          <div className={styles.heroTextSide}>
            <span className={styles.heroBadge}>NEW COLLECTION</span>
            <h1>Your Skin Deserves<br/>Korean Excellence</h1>
            <p>Discover our handpicked selection of premium K-Beauty products. From serums to sunscreens — everything your skin craves.</p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={styles.ctaPrimary}>Shop Now</Link>
              <Link href="/shop?category=Serum%2FEssence" className={styles.ctaSecondary}>Explore Serums</Link>
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
            <span>On orders over Rs. 5,000</span>
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

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className={`container ${styles.sectionBlock}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>BROWSE</span>
          <h2>Shop by Category</h2>
          <p className={styles.sectionSub}>Find exactly what your skin needs</p>
        </div>
        <ShopByCategory />
      </section>

      {/* ===== FULL WIDTH PROMO BANNER ===== */}
      <section className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <div className={styles.promoText}>
            <span className={styles.promoTag}>YOUR ROUTINE, PERFECTED</span>
            <h2>Build Your K-Beauty Routine</h2>
            <p>Follow the famous Korean 4-step routine for glass skin. Cleanse → Tone → Treat → Moisturize. We have everything you need.</p>
            <Link href="/shop" className={styles.ctaPrimary}>Start Your Routine</Link>
          </div>
          <div className={styles.promoImage}>
            <img src="/images/routine_banner.png" alt="K-Beauty Routine" />
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS / NEW ARRIVALS TABS ===== */}
      <section className={`container ${styles.sectionBlock}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>CURATED</span>
          <h2>Our Collections</h2>
          <p className={styles.sectionSub}>Explore our best sellers and newest arrivals</p>
        </div>
        <HomeProductTabs />
      </section>

      {/* ===== SHOP BY BRAND (Premium Cards) ===== */}
      <section className={`container ${styles.sectionBlock}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>BRANDS</span>
          <h2>Shop By Brand</h2>
          <p className={styles.sectionSub}>Explore our official K-Beauty partners</p>
        </div>
        
        <div className={styles.brandGrid}>
          <Link href="/shop?brand=Anua" className={styles.brandCard}>
            <div className={styles.brandOverlay}></div>
            <img src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800" alt="Anua" className={styles.brandBg} />
            <div className={styles.brandContent}>
              <h3>Anua</h3>
              <span>Heartleaf Collection →</span>
            </div>
          </Link>

          <Link href="/shop?brand=Skin1004" className={styles.brandCard}>
            <div className={styles.brandOverlay}></div>
            <img src="https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800" alt="Skin1004" className={styles.brandBg} />
            <div className={styles.brandContent}>
              <h3>Skin1004</h3>
              <span>Centella Line →</span>
            </div>
          </Link>

          <Link href="/shop?brand=Haru Haru Wonder" className={styles.brandCard}>
            <div className={styles.brandOverlay}></div>
            <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800" alt="Haru Haru Wonder" className={styles.brandBg} />
            <div className={styles.brandContent}>
              <h3>Haru Haru Wonder</h3>
              <span>Black Rice Line →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ===== FULL WIDTH IMAGE BANNER ===== */}
      <section className={styles.fullBanner}>
        <img src="/images/hero_banner_main.png" alt="Beauty Bees Collection" className={styles.fullBannerImg} />
        <div className={styles.fullBannerOverlay}>
          <h2>Where Science Meets Beauty</h2>
          <p>Every product in our store is backed by Korean dermatological research and loved by millions worldwide.</p>
          <Link href="/shop" className={styles.ctaWhite}>Explore All Products</Link>
        </div>
      </section>

      {/* ===== WHY BEAUTY BEES (Icon Grid) ===== */}
      <section className={styles.whySection}>
        <div className={`container`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>WHY US</span>
            <h2>The Beauty Bees Difference</h2>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🇰🇷</div>
              <h3>Direct from Korea</h3>
              <p>We source directly from official Korean distributors. Zero middlemen, zero counterfeits.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🧪</div>
              <h3>Dermatologist Tested</h3>
              <p>Every brand in our catalog is clinically tested and approved by Korean dermatologists.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>🌿</div>
              <h3>Clean Ingredients</h3>
              <p>No parabens, no sulfates, no animal testing. Just pure, effective skincare.</p>
            </div>
            <div className={styles.whyCard}>
              <div className={styles.whyIcon}>💬</div>
              <h3>Expert Support</h3>
              <p>Not sure what to buy? Our skincare experts help you find the perfect routine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SIGNUP ===== */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterContent}>
          <h2>Join the Beauty Bees Family</h2>
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
