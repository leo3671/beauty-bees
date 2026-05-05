"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Cart.module.css';
import { useCart } from '../lib/CartContext';

export default function Cart({ isOpen, onClose }) {
  const { cartItems = [], setCartItems } = useCart() || {};

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }
    return () => document.body.classList.remove('cart-open');
  }, [isOpen]);

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.cartDrawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Beauty Bees Cosmetics</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={styles.content}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛍️</div>
              <h3>Your cart is currently empty.</h3>
              <p>Find something you love and start shopping!</p>
              <button className={styles.continueBtn} onClick={onClose}>Shop our Best Sellers</button>
            </div>
          ) : (
            <div className={styles.itemsList}>
               {cartItems.map((item, index) => (
                 <div key={index} className={styles.cartItem}>
                   <img src={item.image} alt={item.name} className={styles.itemImage} />
                   <div className={styles.itemInfo}>
                     <h4>{item.name}</h4>
                     <div className={styles.itemControls}>
                       <span className={styles.itemPrice}>Rs. {(item.price * (item.quantity || 1)).toLocaleString()}</span>
                       <div className={styles.qtySelector}>
                         <button 
                          onClick={() => {
                            const newItems = [...cartItems];
                            if ((newItems[index].quantity || 1) > 1) {
                              newItems[index].quantity = (newItems[index].quantity || 1) - 1;
                              setCartItems(newItems);
                            }
                          }}
                         >−</button>
                         <span>{item.quantity || 1}</span>
                         <button 
                          onClick={() => {
                            const newItems = [...cartItems];
                            newItems[index].quantity = (newItems[index].quantity || 1) + 1;
                            setCartItems(newItems);
                          }}
                         >+</button>
                       </div>
                     </div>
                   </div>
                   <button 
                     className={styles.removeBtn} 
                     onClick={() => {
                       const newItems = [...cartItems];
                       newItems.splice(index, 1);
                       setCartItems(newItems);
                     }}
                     aria-label="Remove item"
                   >
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                     </svg>
                   </button>
                 </div>
               ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Subtotal</span>
            <span>Rs. {cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0).toLocaleString()}</span>
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
