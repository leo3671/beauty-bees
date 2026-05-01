"use client";

import { useCart } from '../lib/CartContext';
import { useProducts } from '../lib/ProductContext';
import styles from './CheckoutCrossSell.module.css';

export default function CheckoutCrossSell() {
  const { cartItems = [], setCartItems } = useCart() || {};
  const { products } = useProducts();
  
  if (!cartItems || cartItems.length === 0 || !products) return null;

  // Find products NOT currently in the cart
  const cartIds = cartItems.map(item => item.id);
  const availableCrossSells = products.filter(p => !cartIds.includes(p.id));
  
  if (availableCrossSells.length === 0) return null;
  
  // Pick the top 2 cross sells (ideally accessories or highly rated small items)
  // For demo, just slice 2 from best sellers
  const recommendations = availableCrossSells
    .sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
    .slice(0, 2);

  const handleAdd = (product) => {
    if (setCartItems) {
      setCartItems(prev => [...prev, product]);
    }
  };

  return (
    <div className={styles.crossSellContainer}>
      <h3>Frequently Bought Together</h3>
      <div className={styles.crossSellList}>
        {recommendations.map(product => (
          <div key={product.id} className={styles.crossSellItem}>
            <div className={styles.itemImageWrap}>
              <img src={product.image} alt={product.name} />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemName}>{product.name}</p>
              <p className={styles.itemPrice}>Rs. {product.price}</p>
            </div>
            <button 
              className={styles.addBtn}
              onClick={() => handleAdd(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
