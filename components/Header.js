"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';
import SearchBar from './SearchBar';
import { cn } from '@/lib/utils';

export default function Header() {
  const { openCart, cartItems = [] } = useCart() || {};
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ siteName: 'Beauty Bees', logoUrl: null });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSiteSettings(data);
      } catch (e) {
        console.error("Settings fetch failed", e);
      }
    };
    fetchSettings();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const cartCount = cartItems.length;

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/shop?filter=brands', label: t('nav.brands') },
  ];

  return (
    <header className="sticky top-0 z-[9999] bg-white border-b border-bb-border/50 shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
      {/* Announcement Bar */}
      <div className="bg-bb-text text-white text-center py-2.5 px-4 text-xs tracking-widest uppercase font-medium">
        <p>
          {language === 'en'
            ? 'Free Shipping across Nepal on orders over Rs. 10,000!'
            : '१०,००० भन्दा बढीको अर्डरमा नेपालभर नि:शुल्क ढुवानी!'}
        </p>
      </div>

      {/* Nav Container */}
      <div className="container flex items-center justify-between h-[70px] gap-3 px-4 lg:px-6">
        {/* Burger — mobile only */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="flex flex-col gap-[5px] p-2.5 bg-transparent border-none cursor-pointer z-[2002] relative"
          >
            <span className={cn(
              "block w-6 h-0.5 bg-bb-text transition-all duration-300",
              isMenuOpen && "translate-y-[7px] rotate-45"
            )} />
            <span className={cn(
              "block w-6 h-0.5 bg-bb-text transition-all duration-300",
              isMenuOpen && "opacity-0"
            )} />
            <span className={cn(
              "block w-6 h-0.5 bg-bb-text transition-all duration-300",
              isMenuOpen && "-translate-y-[7px] -rotate-45"
            )} />
          </button>
        </div>

        {/* Logo */}
        <div className={cn("flex items-center", "lg:flex-none", "max-lg:flex-1 max-lg:justify-center")}>
          <Link href="/">
            {siteSettings.logoUrl && !imgError ? (
              <div className="relative h-[50px] w-[140px] max-lg:h-[40px] max-lg:w-[120px] flex items-center">
                <Image
                  src={siteSettings.logoUrl}
                  alt={`${siteSettings.siteName} Official Logo`}
                  fill
                  priority
                  style={{ objectFit: 'contain' }}
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <h1 className="m-0 text-xl font-bold text-bb-text tracking-wide">
                {siteSettings.siteName.toUpperCase()}
              </h1>
            )}
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[0.95rem] font-medium uppercase tracking-[0.5px] text-bb-text relative
                after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-bb-pink
                after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link
              href="/admin/dashboard"
              className="text-[0.95rem] font-bold uppercase tracking-[0.5px] text-bb-pink"
            >
              ADMIN DASHBOARD
            </Link>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {/* Desktop SearchBar */}
          <div className="hidden lg:block">
            <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="lg:hidden bg-transparent border-none text-bb-text hover:text-bb-pink transition-colors flex items-center"
            onClick={toggleSearch}
            aria-label="Toggle Search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>

          {/* Account */}
          <Link
            href={user ? "/account" : "/login"}
            className="bg-transparent border-none text-bb-text hover:text-bb-pink transition-colors flex items-center"
            aria-label={user ? "My Account" : "Login"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Cart */}
          <button
            aria-label="Cart"
            className="relative bg-transparent border-none text-bb-text hover:text-bb-pink transition-colors"
            onClick={openCart}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-bb-pink text-white text-[0.7rem] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (full width slide-down) */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 py-3 bg-white border-t border-bb-border/30">
          <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Nav Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[9999] flex flex-col pt-[100px] px-8",
          "shadow-[15px_0_45px_rgba(0,0,0,0.15)] border-r border-bb-border/30",
          "transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setIsMenuOpen(false)}
            className="text-[1.1rem] font-semibold uppercase tracking-wider text-bb-text
              border-b border-bb-border/60 py-5 flex items-center justify-between min-h-[44px] w-full"
          >
            {label}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ))}
        {user?.role === 'admin' && (
          <Link
            href="/admin/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="text-[1.1rem] font-bold uppercase tracking-wider text-bb-pink
              border-b border-bb-border/60 py-5 flex items-center justify-between min-h-[44px] w-full"
          >
            ADMIN DASHBOARD
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-30">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] animate-fade-in"
          onClick={toggleMenu}
        />
      )}
    </header>
  );
}
