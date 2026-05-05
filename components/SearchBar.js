"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './SearchBar.module.css';

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      if (onClose) onClose();
    }
  };

  return (
    <div className={`${styles.searchContainer} ${isOpen ? styles.open : ''}`} ref={searchRef}>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.searchWrapper}>
        <button className={styles.closeMobile} onClick={onClose} type="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search for brands, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            className={styles.searchInput}
            autoFocus={isOpen}
          />
          <button type="submit" className={styles.searchBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </form>

        {showDropdown && (
          <div className={styles.resultsDropdown}>
            {loading && <div className={styles.loading}>Searching...</div>}
            {!loading && results.length === 0 && query.length >= 2 && (
              <div className={styles.noResults}>No products found for "{query}"</div>
            )}
            {results.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.id}`}
                className={styles.resultItem}
                onClick={() => {
                  setShowDropdown(false);
                  if (onClose) onClose();
                }}
              >
                <img src={product.image} alt={product.name} className={styles.resultImg} />
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{product.name}</span>
                  <span className={styles.resultBrand}>{product.brand}</span>
                </div>
                <span className={styles.resultPrice}>Rs.{product.price}</span>
              </Link>
            ))}
            {results.length > 0 && (
              <Link 
                href={`/shop?search=${encodeURIComponent(query)}`} 
                className={styles.viewAll}
                onClick={() => {
                  setShowDropdown(false);
                  if (onClose) onClose();
                }}
              >
                View all results for "{query}"
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
