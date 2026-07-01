"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
    <div
      className={cn(
        "relative w-full max-w-[400px]",
        // Mobile: fullwidth panel
        "max-sm:max-w-none max-sm:static",
        isOpen && "max-sm:block"
      )}
      ref={searchRef}
    >
      {/* Mobile overlay behind the search bar */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[199]"
          onClick={onClose}
        />
      )}

      {/* Search form wrapper */}
      <div className={cn(
        "relative",
        // On mobile, slide in from top when open
        "max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:right-0 max-sm:bg-white max-sm:p-[15px] max-sm:z-[200] max-sm:shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-sm:flex max-sm:gap-3 max-sm:items-center",
        isOpen ? "max-sm:translate-y-0" : "max-sm:-translate-y-full max-sm:pointer-events-none",
        "max-sm:transition-transform max-sm:duration-300"
      )}>
        {/* Close (mobile only) */}
        <button
          className="hidden max-sm:flex bg-transparent border-none text-[#8a7b7e] cursor-pointer items-center"
          onClick={onClose}
          type="button"
          aria-label="Close search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <form
          onSubmit={handleSearch}
          className={cn(
            "flex items-center bg-[#fdf2f4] rounded-full px-4 py-1 border border-transparent transition-all duration-200",
            "focus-within:bg-white focus-within:border-bb-pink focus-within:shadow-[0_0_0_3px_rgba(242,182,193,0.2)]",
            "max-sm:flex-1"
          )}
        >
          <input
            type="text"
            placeholder="Search for brands, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            className="flex-1 bg-transparent border-none py-2 text-[0.9rem] outline-none text-bb-text placeholder:text-slate-400"
            autoFocus={isOpen}
          />
          <button
            type="submit"
            className="bg-transparent border-none text-[#8a7b7e] cursor-pointer flex items-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Results dropdown */}
      {showDropdown && (
        <div className="absolute top-[calc(100%+10px)] left-0 right-0 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[1000] animate-fade-in max-sm:top-full max-sm:rounded-b-2xl max-sm:rounded-t-none">
          {loading && (
            <div className="py-6 text-center text-[#8a7b7e] text-[0.9rem]">Searching...</div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="py-6 text-center text-[#8a7b7e] text-[0.9rem]">No products found for &quot;{query}&quot;</div>
          )}
          {Array.isArray(results) && results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex items-center gap-3 px-4 py-3 no-underline border-b border-slate-50 transition-colors hover:bg-[#fdf2f4]"
              onClick={() => { setShowDropdown(false); if (onClose) onClose(); }}
            >
              <img src={product.image} alt={product.name} className="w-[45px] h-[45px] object-cover rounded-lg" />
              <div className="flex-1 flex flex-col">
                <span className="text-[0.9rem] font-semibold text-bb-text">{product.name}</span>
                <span className="text-[0.75rem] text-[#8a7b7e]">{product.brand}</span>
              </div>
              <span className="text-[0.9rem] font-bold text-bb-pink">Rs.{product.price}</span>
            </Link>
          ))}
          {results.length > 0 && (
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              className="block py-3.5 text-center bg-[#fdf2f8] text-pink-700 font-bold text-[0.85rem] no-underline hover:bg-bb-peach transition-colors"
              onClick={() => { setShowDropdown(false); if (onClose) onClose(); }}
            >
              View all results for &quot;{query}&quot;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
