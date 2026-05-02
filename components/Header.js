"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import SearchBar from './SearchBar';

export default function Header() {
  const { openCart, cartItems = [] } = useCart() || {};
  const { language, toggleLanguage, t } = useLanguage();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        // Not logged in
      }
    };
    checkAuth();
  }, []);

  // Calculate total items in cart
  const cartCount = cartItems.length;

  return (
    <header className={styles.header}>
      <div className={styles.announcement}>
        <p>{language === 'en' ? 'Free Shipping across Nepal on orders over Rs. 10,000!' : '१०,००० भन्दा बढीको अर्डरमा नेपालभर नि:शुल्क ढुवानी!'}</p>
      </div>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.mobileMenu}>
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
        
        <div className={styles.logo}>
          <Link href="/">
            <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo_fixed.png" 
                alt="Beauty Bees Logo" 
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }} 
              />
            </div>
          </Link>
        </div>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.mobileActive : ''}`}>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className={styles.link} onClick={() => setIsMenuOpen(false)} style={{color: 'var(--primary-pink)', fontWeight: '600'}}>
              Dashboard
            </Link>
          )}
        </nav>

        <div className={styles.icons}>
          <button className={styles.langToggle} onClick={toggleLanguage}>
            {language === 'en' ? 'नेपाली' : 'English'}
          </button>
          <SearchBar />
          
          <Link href={user ? "/account" : "/login"} className={styles.iconBtn} aria-label={user ? "My Account" : "Login"}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {user && <span style={{ fontSize: '0.85em', fontWeight: '500', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>{user.name || 'Account'}</span>}
            </div>
          </Link>

          <button aria-label="Cart" className={styles.cartButton} onClick={openCart}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className={styles.cartCount}>{cartCount}</span>
          </button>
        </div>
      </div>
      {isMenuOpen && <div className={styles.backdrop} onClick={toggleMenu} />}
    </header>
  );
}
