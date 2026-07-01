"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useProducts } from '../lib/ProductContext';
import { cn } from '@/lib/utils';

export default function HomeProductTabs() {
  const [activeTab, setActiveTab] = useState('new');
  const { products } = useProducts();

  const newArrivals   = Array.isArray(products) ? products.filter(p => p.isNew).slice(0, 4) : [];
  const bestSellers   = Array.isArray(products) ? products.filter(p => p.isBestSeller).slice(0, 4) : [];
  const displayedProducts = activeTab === 'new' ? newArrivals : bestSellers;

  return (
    <div className="py-8">
      {/* Tab Switcher */}
      <div className="flex justify-center gap-3 mb-8">
        {[
          { key: 'new',  label: 'New Arrivals' },
          { key: 'best', label: 'Best Sellers' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200",
              activeTab === tab.key
                ? "bg-bb-pink text-white border-bb-pink shadow-md"
                : "bg-white text-bb-text border-bb-border hover:border-bb-pink hover:text-bb-pink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-10">
        <Link
          href="/shop"
          className="inline-block px-8 py-3 border-2 border-bb-pink text-bb-pink font-semibold rounded-full
            hover:bg-bb-pink hover:text-white transition-colors duration-200 no-underline"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
