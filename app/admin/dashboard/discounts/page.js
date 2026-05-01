"use client";

import { useState } from 'react';
import { useProducts } from '../../../../lib/ProductContext';
import styles from '../page.module.css';
import Link from 'next/link';

export default function DiscountsOffers() {
  const { products, loading, editProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountAmount, setDiscountAmount] = useState('');
  const [isPercentage, setIsPercentage] = useState(true);

  if (loading) return <div>Loading products...</div>;

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !discountAmount) return;

    let originalPrice = selectedProduct.originalPrice || selectedProduct.price;
    let newPrice;

    if (isPercentage) {
      newPrice = Math.floor(originalPrice - (originalPrice * (parseFloat(discountAmount) / 100)));
    } else {
      newPrice = Math.floor(originalPrice - parseFloat(discountAmount));
    }

    if (newPrice < 0) newPrice = 0;

    const updatedProduct = {
      ...selectedProduct,
      originalPrice: originalPrice,
      price: newPrice
    };

    await editProduct(updatedProduct);
    setSelectedProduct(null);
    setDiscountAmount('');
  };

  const handleRemoveDiscount = async (product) => {
    if (!product.originalPrice) return;
    const updatedProduct = {
      ...product,
      price: product.originalPrice,
    };
    delete updatedProduct.originalPrice;
    await editProduct(updatedProduct);
  };

  return (
    <div>
      <h1 className={styles.title}>Discounts & Offers</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Select a product to apply a discount. The storefront will automatically display a "Sale" badge and show the original price crossed out.
      </p>

      {selectedProduct && (
        <div style={{ background: '#fffbeb', border: '1px solid #fbbf24', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Apply Discount to: {selectedProduct.name}</h3>
          <p>Current Price: Rs. {selectedProduct.price}</p>
          <form onSubmit={handleApplyDiscount} style={{ display: 'flex', gap: '15px', marginTop: '15px', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="Amount" 
              value={discountAmount}
              onChange={e => setDiscountAmount(e.target.value)}
              required
              style={{ padding: '8px', width: '120px' }}
            />
            <select value={isPercentage} onChange={e => setIsPercentage(e.target.value === 'true')} style={{ padding: '8px' }}>
              <option value="true">% Off</option>
              <option value="false">Rs. Off</option>
            </select>
            <button type="submit" style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Set Discount
            </button>
            <button type="button" onClick={() => setSelectedProduct(null)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Original Price</th>
              <th>Current Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const isOnSale = product.originalPrice && product.originalPrice > product.price;
              return (
                <tr key={product.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={product.image} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
                  </td>
                  <td style={{ color: isOnSale ? '#999' : 'inherit', textDecoration: isOnSale ? 'line-through' : 'none' }}>
                    Rs. {product.originalPrice || product.price}
                  </td>
                  <td style={{ fontWeight: isOnSale ? 'bold' : 'normal', color: isOnSale ? '#ef4444' : 'inherit' }}>
                    Rs. {product.price}
                  </td>
                  <td>
                    {isOnSale ? (
                      <span className={`${styles.badge}`} style={{ background: '#fee2e2', color: '#ef4444' }}>On Sale</span>
                    ) : (
                      <span className={`${styles.badge}`} style={{ background: '#f1f5f9', color: '#64748b' }}>Regular</span>
                    )}
                  </td>
                  <td>
                    {isOnSale ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setSelectedProduct(product)} style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>Edit Discount</button>
                        <button onClick={() => handleRemoveDiscount(product)} style={{ color: '#64748b', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>Remove Sale</button>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedProduct(product)} style={{ color: '#2563eb', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '500' }}>Set Discount</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
