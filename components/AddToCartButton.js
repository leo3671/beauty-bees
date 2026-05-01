"use client";

import { useCart } from '../lib/CartContext';
import styles from './AddToCartButton.module.css';
import { toast } from 'react-hot-toast';

export default function AddToCartButton({ product }) {
  const { setCartItems, openCart } = useCart() || {};

  const handleAdd = () => {
    if (setCartItems && openCart) {
      if (product.stock <= 0) {
        toast.error('Sorry, this product is out of stock!');
        return;
      }
      setCartItems(prev => [...prev, product]);
      toast.success(`${product.name} added to cart!`, { icon: '🐝' });
      openCart();
    }
  };

  return (
    <button className={styles.button} onClick={handleAdd}>
      Add to Cart - Rs. {product.price}
    </button>
  );
}
