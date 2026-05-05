"use client";

import { useState, useEffect } from 'react';
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
    category: 'Cleansers',
    description: '',
    imageBase64: '',
    imagePreview: '',
    stock: 50,
    inStock: true,
    skinType: [],
    ingredients: [],
    isNew: false,
    isBestSeller: false
  });

  const [dbBrands, setDbBrands] = useState([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const skinTypes = ['Oily', 'Dry', 'Sensitive', 'Combination', 'All Skin Types', 'Acne-Prone'];
  const categories = ['Cleansers', 'Toners', 'Serums', 'Moisturizers', 'Sunscreen'];

  useEffect(() => {
    const fetchDbBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        if (res.ok) {
          const data = await res.json();
          setDbBrands(data);
        }
      } catch (e) {
        console.error("Failed to fetch brands", e);
      }
    };
    fetchDbBrands();
  }, []);

  const handleSkinTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter(t => t !== type)
        : [...prev.skinType, type]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          imageBase64: reader.result,
          imagePreview: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const productPayload = {
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock || 0)
      };
      // Don't send preview URL if it's already an existing cloud URL
      if (!formData.imageBase64) {
        delete productPayload.imageBase64;
      }
      delete productPayload.imagePreview;

      if (editingProductId) {
        await editProduct({ ...productPayload, id: editingProductId });
      } else {
        await addProduct(productPayload);
      }
      
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert("Error saving product. Check Cloudinary configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingProductId(null);
    setFormData({
      name: '', brand: '', price: '', category: 'Cleansers', description: '', imageBase64: '', imagePreview: '', stock: 50, inStock: true, skinType: [], ingredients: [], isNew: false, isBestSeller: false
    });
    setIsCustomCategory(false);
  };

  const handleEditClick = (product) => {
    setIsCustomCategory(!categories.includes(product.category));
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      imageBase64: '',
      imagePreview: product.image,
      stock: product.stock || 0,
      inStock: product.inStock !== false,
      skinType: typeof product.skinType === 'string' ? JSON.parse(product.skinType || '[]') : (product.skinType || []),
      ingredients: typeof product.ingredients === 'string' ? JSON.parse(product.ingredients || '[]') : (product.ingredients || []),
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false
    });
    setEditingProductId(product.id);
    setShowAddModal(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading premium inventory...</div>;

  const brandList = Array.from(new Set([...dbBrands.map(b => b.name), ...products.map(p => p.brand)])).filter(b => b);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className={styles.title} style={{ marginBottom: '4px' }}>Product Catalog</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your inventory, pricing, and professional product photography.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          style={{
            backgroundColor: '#1a1a1a', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '12px',
            cursor: 'pointer',
            border: 'none',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <span>+</span> Add New Product
        </button>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{
            background: 'white', padding: '40px', borderRadius: '24px', 
            width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Heartleaf 77% Soothing Toner" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Brand</label>
                <select 
                  value={!formData.brand || !brandList.includes(formData.brand) ? 'Other' : formData.brand} 
                  onChange={e => setFormData({...formData, brand: e.target.value === 'Other' ? '' : e.target.value})} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white' }}
                >
                  <option value="" disabled>Select Brand</option>
                  {brandList.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                  <option value="Other">Custom Brand...</option>
                </select>
                {(!formData.brand || !brandList.includes(formData.brand)) && (
                  <input placeholder="Enter new brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '8px' }} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Category</label>
                <select 
                  value={isCustomCategory ? 'Other' : formData.category} 
                  onChange={e => {
                    if (e.target.value === 'Other') { setIsCustomCategory(true); setFormData({...formData, category: ''}); }
                    else { setIsCustomCategory(false); setFormData({...formData, category: e.target.value}); }
                  }} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white' }}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="Other">Custom Category...</option>
                </select>
                {isCustomCategory && (
                  <input placeholder="Enter category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '8px' }} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Price (Rs.)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Stock Quantity</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Product Photography (Cloud Upload)</label>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#f8fafc', border: '2px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {formData.imagePreview ? <img src={formData.imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#94a3b8', fontSize: '2rem' }}>📷</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="imageUpload" />
                    <label htmlFor="imageUpload" style={{ display: 'inline-block', padding: '10px 20px', background: '#f1f5f9', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#1a1a1a' }}>Choose File</label>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>High-res JPG or PNG with white background recommended.</p>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', minHeight: '100px' }} />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#1a1a1a', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                  {isSubmitting ? 'Processing Cloud Upload...' : 'Save Product & Update Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer} style={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ paddingLeft: '32px' }}>Product</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Inventory</th>
              <th style={{ paddingRight: '32px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ paddingLeft: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '12px', background: '#f8fafc' }} />
                    <div>
                      <div style={{ fontWeight: '700', color: '#1a1a1a' }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{product.category}</div>
                    </div>
                  </div>
                </td>
                <td><span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>{product.brand}</span></td>
                <td style={{ fontWeight: '700' }}>Rs. {product.price.toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%`, height: '100%', background: product.stock > 10 ? '#22c55e' : '#ef4444' }}></div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{product.stock || 0}</span>
                  </div>
                </td>
                <td style={{ paddingRight: '32px', textAlign: 'right' }}>
                  <button onClick={() => handleEditClick(product)} style={{ color: '#1a1a1a', fontWeight: '700', border: '1px solid #e2e8f0', background: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px' }}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} style={{ color: '#ef4444', fontWeight: '700', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
