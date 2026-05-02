"use client";

import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { useCart } from '../lib/CartContext';
import { useLanguage } from '../lib/LanguageContext';
import { toast } from 'react-hot-toast';
import ProductRating from './ProductRating';

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
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {product.originalPrice && product.originalPrice > product.price && <span className={`${styles.badge} ${styles.saleBadge}`}>Sale</span>}
        {!product.originalPrice && product.isNew && <span className={styles.badge}>New</span>}
        <img src={product.image} alt={product.name} className={styles.image} style={{ opacity: product.inStock === false ? 0.5 : 1 }} />
        
        <div className={styles.overlay}>
          <button 
            className={styles.quickAdd} 
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            style={{ opacity: product.inStock === false ? 0.5 : 1, cursor: product.inStock === false ? 'not-allowed' : 'pointer' }}
          >
            {product.inStock === false ? t('out_of_stock') : t('quick_add')}
          </button>
        </div>
      </div>
      
      <div className={styles.info}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <ProductRating productId={product.id} />
        <p className={styles.price}>
          Rs. {product.price}
          {product.originalPrice && product.originalPrice > product.price && (
            <del style={{ color: '#999', fontSize: '0.85em', marginLeft: '8px' }}>Rs. {product.originalPrice}</del>
          )}
        </p>
      </div>
    </Link>
  );
}
