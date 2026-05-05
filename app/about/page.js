import styles from '../page.module.css';

export default function About() {
  return (
    <div className={styles.page}>
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--accent-peach)' }}>
        <div className="container">
          <span className={styles.sectionTag}>OUR STORY</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: 'var(--text-color)' }}>Authentic K-Beauty for Nepal</h1>
          <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.8', color: '#6b5b5e' }}>
            Beauty Bees Cosmetics was born from a simple realization: finding 100% authentic Korean skincare in Nepal shouldn't be a challenge. We are dedicated to bringing you the gold standard of skincare—directly from Seoul to your doorstep.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 20px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-color)' }}>Our Mission</h2>
            <p style={{ lineHeight: '1.7', color: '#8a7b7e' }}>
              We empower our customers to achieve their best skin through education and access to high-performance, dermatologist-tested products. Every brand in our catalog is carefully vetted for efficacy and authenticity.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-color)' }}>Why "Beauty Bees Cosmetics"?</h2>
            <p style={{ lineHeight: '1.7', color: '#8a7b7e' }}>
              Just like bees carefully curate the best nectar to create honey, we meticulously select the best skincare innovations from South Korea to bring you sweetness and glow for your skin journey.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: '#fff', textAlign: 'center' }}>
        <div className="container">
          <img src="/images/kbeauty_brands.png" alt="Our Brands" style={{ width: '100%', maxWidth: '1000px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>100% Authentic. Always.</h2>
            <p style={{ color: '#8a7b7e' }}>We source directly from official brand distributors in South Korea. No middlemen, no fakes, just the real deal.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
