"use client";

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { toast } from 'react-hot-toast';

export default function BrandsManagement() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands?all=true');
      const data = await res.json();
      setBrands(data);
    } catch (e) {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch('/api/brands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchBrands();
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Brand saved successfully!");
        setShowModal(false);
        setFormData({ name: '', logo: '' });
        fetchBrands();
      } else {
        toast.error("Failed to save brand");
      }
    } catch (e) {
      toast.error("Error saving brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch('/api/brands', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success("Brand deleted");
        fetchBrands();
      }
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div>Loading brands...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className={styles.title}>Brand Logos</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: 'var(--text-color)', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          + Add New Brand
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Brand Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(brands) && brands.map((brand) => (
              <tr key={brand.id}>
                <td>
                  <img src={brand.logo} alt={brand.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                </td>
                <td>{brand.name}</td>
                <td>
                  <button 
                    onClick={() => handleToggleStatus(brand.id, brand.isActive)}
                    className={styles.badge} 
                    style={{ 
                      backgroundColor: brand.isActive ? '#f0fdf4' : '#fef2f2', 
                      color: brand.isActive ? '#166534' : '#991b1b',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {brand.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(brand.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '400px' }}>
            <h2>Add Brand</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Brand Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px' }} placeholder="e.g. Anua" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Brand Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ width: '100%' }} />
                {formData.logo && <img src={formData.logo} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '6px' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '10px', background: 'var(--primary-pink)', color: 'white', border: 'none', borderRadius: '6px' }}>
                  {isSubmitting ? 'Saving...' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
