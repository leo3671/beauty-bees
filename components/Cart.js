"use client";

import Link from 'next/link';
import styles from './Cart.module.css';
import { useCart } from '../lib/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { cartItems = [], setCartItems } = useCart() || {};

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.cartDrawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is currently empty.</p>
              <button className={styles.continueBtn} onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p>Rs. {item.price}</p>
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => {
                        const newItems = [...cartItems];
                        newItems.splice(index, 1);
                        setCartItems(newItems);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Subtotal</span>
            <span>Rs. {cartItems.reduce((acc, item) => acc + item.price, 0)}</span>
          </div>
          <p className={styles.taxes}>Taxes and shipping calculated at checkout.</p>
          <Link href="/checkout" className={styles.checkoutBtn} onClick={onClose}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
