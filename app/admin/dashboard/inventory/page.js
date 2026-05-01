"use client";

import { useState } from 'react';
import { useProducts } from '../../../../lib/ProductContext';
import styles from '../page.module.css';

export default function InventoryManagement() {
  const { products, loading, deleteProduct, addProduct, editProduct } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'Cleanser',
    description: '',
    imageBase64: '',
    stock: 0,
    inStock: true
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageBase64: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingProductId) {
        const updatedProduct = {
          ...formData,
          id: editingProductId,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock || 0)
        };
        await editProduct(updatedProduct);
      } else {
        const newProduct = {
          ...formData,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock || 0),
          isNew: true,
          isBestSeller: false
        };
        await addProduct(newProduct);
      }
      
      setShowAddModal(false);
      setEditingProductId(null);
      setFormData({
        name: '', brand: '', price: '', category: 'Cleanser', description: '', imageBase64: '', stock: 0
      });
    } catch (err) {
      alert("Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      imageBase64: '',
      stock: product.stock || 0,
      inStock: product.inStock !== false // Default to true if undefined
    });
    setEditingProductId(product.id);
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Inventory & Pricing</h1>
        <button 
          onClick={() => {
            setEditingProductId(null);
            setFormData({ name: '', brand: '', price: '', category: 'Cleanser', description: '', imageBase64: '', stock: 0, inStock: true });
            setShowAddModal(true);
          }}
          style={{
            backgroundColor: 'var(--text-color)', 
            color: 'var(--white)', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          + Add New Product
        </button>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '8px', 
            width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Brand</label>
                <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                  <option value="Cleanser">Cleanser</option>
                  <option value="Toner">Toner</option>
                  <option value="Serum/Essence">Serum/Essence</option>
                  <option value="Moisturizer">Moisturizer</option>
                  <option value="Sunscreen">Sunscreen</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  checked={formData.inStock} 
                  onChange={e => setFormData({...formData, inStock: e.target.checked})} 
                  id="inStockCheck"
                />
                <label htmlFor="inStockCheck" style={{ margin: 0 }}>Product is In Stock</label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Price (Rs.)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Stock Quantity</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Product Image</label>
                <input required type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px', flex: 1, background: '#eee', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ padding: '10px', flex: 1, background: 'var(--primary-pink)', color: 'white', border: 'none', cursor: 'pointer' }}>
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ maxWidth: '250px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.name}
                  </div>
                </td>
                <td>{product.brand}</td>
                <td style={{ fontWeight: '500' }}>Rs. {product.price}</td>
                <td style={{ fontWeight: '500' }}>{product.stock || 0}</td>
                <td>
                  <span className={`${styles.badge} ${product.stock > 0 ? styles.delivered : styles.pending}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEditClick(product)} style={{ color: '#2563eb', fontWeight: '500', border: 'none', background: 'none', cursor: 'pointer', marginRight: '15px' }}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} style={{ color: '#ef4444', fontWeight: '500', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
