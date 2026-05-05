import styles from '../page.module.css';

export default function Terms() {
  return (
    <div className={styles.page}>
      <section style={{ padding: '80px 20px', background: 'var(--bg-color)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Terms & Conditions</h1>
          
          <div style={{ color: '#4a3b3e', lineHeight: '1.8' }}>
            <h2 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '16px' }}>1. Authenticity Guarantee</h2>
            <p>All products sold on Beauty Bees are 100% authentic and sourced directly from official distributors in South Korea. We do not deal in counterfeit or expired products.</p>

            <h2 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '16px' }}>2. Pricing and Payments</h2>
            <p>Prices are listed in Nepalese Rupees (Rs.). We accept Cash on Delivery (selected areas), Fonepay, and Bank Transfers. Prices are subject to change based on international shipping and currency fluctuations.</p>

            <h2 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '16px' }}>3. Shipping Policy</h2>
            <p>We ship nationwide across Nepal. Free shipping is applicable on orders above Rs. 10,000. For orders below this amount, a flat shipping fee will be charged based on the delivery location.</p>

            <h2 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '16px' }}>4. Privacy Policy</h2>
            <p>Your personal data (name, email, phone, address) is collected solely for the purpose of processing your orders and improving your shopping experience. We do not sell your data to third parties.</p>

            <h2 style={{ fontSize: '1.5rem', marginTop: '40px', marginBottom: '16px' }}>5. Product Use</h2>
            <p>While we provide recommendations, we advise all customers to perform a patch test before using any new skincare product. Beauty Bees is not liable for individual skin reactions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
