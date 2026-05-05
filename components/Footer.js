import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <img src="/logo_fixed.png" alt="Beauty Bees" style={{ height: '50px', marginBottom: '10px' }} />
          <p>Your destination for authentic Korean beauty in Nepal. We believe in gentle, effective skincare.</p>
        </div>
        
        <div className={styles.links}>
          <h3>Shop</h3>
          <ul>
            <li><Link href="/shop?category=skincare">Skincare</Link></li>
            <li><Link href="/shop?category=makeup">Makeup</Link></li>
            <li><Link href="/shop?filter=best-seller">Best Sellers</Link></li>
          </ul>
        </div>

        <div className={styles.links}>
          <h3>Contact & Info</h3>
          <ul>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/terms">Terms & Privacy</Link></li>
          </ul>
        </div>
        
        <div className={styles.links}>
          <h3>Follow Us</h3>
          <ul style={{ display: 'flex', gap: '15px' }}>
            <li>
              <a href="https://www.instagram.com/beautybees_np?igsh=aXp6cWduaWt2NHZt" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@beautybees_np?_r=1&_t=ZS-95z89RZ9eJF" target="_blank" rel="noreferrer" aria-label="TikTok">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </li>
          </ul>
        </div>
        

      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Beauty Bees. All rights reserved.</p>
      </div>
    </footer>
  );
}
