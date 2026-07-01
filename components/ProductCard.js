"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import { toast } from 'react-hot-toast';
import ProductRating from './ProductRating';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { setCartItems, openCart } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    setCartItems(prev => [...prev, product]);
    openCart();
    toast.success(`${product.name} added to cart!`, {
      icon: '🐝',
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link
      href={`/products/${product.id}`}
      className="block text-inherit no-underline group transition-transform duration-200 hover:-translate-y-[5px]"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-white overflow-hidden rounded-t-xl">
        {/* Badges */}
        {isOnSale && (
          <Badge className="absolute top-2.5 left-2.5 z-10 bg-red-500 text-white text-[0.75rem] font-semibold uppercase rounded-[4px]">
            Sale
          </Badge>
        )}
        {!isOnSale && product.isNew && (
          <Badge className="absolute top-2.5 left-2.5 z-10 bg-bb-text text-white text-[0.75rem] font-semibold uppercase rounded-[4px]">
            New
          </Badge>
        )}

        {/* Product Image */}
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.08]",
            product.stock <= 0 && "opacity-50"
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-[15px] bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
          <button
            className={cn(
              "w-full py-2.5 bg-white text-bb-heading font-semibold rounded border-none cursor-pointer text-sm",
              "transition-colors duration-200 hover:bg-bb-pink hover:text-white",
              product.inStock === false && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleAddToCart}
            disabled={product.inStock === false}
          >
            {product.inStock === false ? t('out_of_stock') : t('quick_add')}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-[15px] pb-[15px]">
        <p className="text-[0.85rem] text-slate-500 mb-1">{product.brand}</p>
        <h3 className="text-base font-medium mb-2 leading-[1.4] line-clamp-2 text-bb-heading">{product.name}</h3>
        <ProductRating productId={product.id} />
        <p className="font-semibold text-[1.1rem] text-bb-text mt-1">
          Rs. {product.price}
          {isOnSale && (
            <del className="text-slate-400 text-[0.85em] ml-2">Rs. {product.originalPrice}</del>
          )}
        </p>
      </div>
    </Link>
  );
}
