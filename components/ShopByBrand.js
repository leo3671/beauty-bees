"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ShopByBrand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        if (data.length > 0) {
          setBrands(data);
        } else {
          setBrands([
            { name: 'Anua',          logo: '/images/brand_anua.png' },
            { name: 'Skin1004',      logo: '/images/brand_skin1004.png' },
            { name: 'Haru Haru Wonder', logo: '/images/brand_haruharu.png' },
            { name: 'Cosrx',         logo: '/images/brand_cosrx.png' },
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch brands", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) return null;

  return (
    <section className="container py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">COLLECTIONS</span>
        <h2 className="font-heading text-3xl font-bold text-bb-heading mb-2">Shop by Brand</h2>
        <p className="text-bb-text/70 text-[0.95rem]">Premium Korean brands you know and love.</p>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.isArray(brands) && brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/shop?brand=${brand.name}`}
            className="flex flex-col items-center gap-3 p-4 bg-white border border-bb-border/40 rounded-2xl
              hover:border-bb-pink hover:shadow-[0_4px_15px_rgba(255,183,197,0.3)] transition-all duration-200 group no-underline"
          >
            <div className="relative w-full h-[60px]">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                style={{ objectFit: 'contain' }}
                loading="lazy"
              />
            </div>
            <span className="text-sm font-semibold text-bb-text text-center group-hover:text-bb-pink transition-colors">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
