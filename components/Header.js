"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import SearchBar from './SearchBar';

export default function Header() {
  const { openCart, cartItems = [] } = useCart() || {};
  const { language, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Calculate total items in cart
  const cartCount = cartItems.length;

  return (
    <header className={styles.header}>
      <div className={styles.announcement}>
        <p>{language === 'en' ? 'Free Shipping across Nepal on orders over Rs. 10,000!' : '१०,००० भन्दा बढीको अर्डरमा नेपालभर नि:शुल्क ढुवानी!'}</p>
      </div>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.mobileMenu}>
          <button onClick={toggleMenu} aria-label="Toggle Menu" className={styles.burgerBtn}>
            <div className={`${styles.burgerLine} ${isMenuOpen ? styles.burgerOpen : ''}`}></div>
            <div className={`${styles.burgerLine} ${isMenuOpen ? styles.burgerOpen : ''}`}></div>
            <div className={`${styles.burgerLine} ${isMenuOpen ? styles.burgerOpen : ''}`}></div>
          </button>
        </div>
        
        <div className={styles.logo}>
          <Link href="/">
            <div style={{ height: '60px', display: 'flex', alignItems: 'center', position: 'relative', width: '150px' }}>
              <Image 
                src="/logo_fixed.png" 
                alt="Beauty Bees Cosmetics Logo" 
                fill
                priority
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </Link>
        </div>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.mobileActive : ''}`}>
          <div className={styles.mobileDrawerHeader}>
            <button onClick={toggleMenu} className={styles.closeDrawerBtn} aria-label="Close Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Link href="/" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            {t('nav.home')}
            <svg className={styles.navArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          <Link href="/shop" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            {t('nav.shop')}
            <svg className={styles.navArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          <Link href="/shop?filter=brands" className={styles.link} onClick={() => setIsMenuOpen(false)}>
            {t('nav.brands')}
            <svg className={styles.navArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className={styles.link} onClick={() => setIsMenuOpen(false)} style={{color: 'var(--primary-pink)', fontWeight: '700'}}>
              ADMIN DASHBOARD
              <svg className={styles.navArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          )}
        </nav>

        <div className={styles.icons}>
          <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          
          <button className={styles.mobileSearchBtn} onClick={toggleSearch} aria-label="Toggle Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>

          
          <Link href={user ? "/account" : "/login"} className={styles.iconBtn} aria-label={user ? "My Account" : "Login"}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
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
