"use client";

import { useState, useEffect } from 'react';
import styles from './discounts.module.css';
import { toast } from 'react-hot-toast';

export default function DiscountManagement() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVoucher, setNewVoucher] = useState({ 
    code: '', 
    discountType: 'percentage', 
    discountValue: '', 
    minOrderValue: 0 
  });

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      if (Array.isArray(data)) setVouchers(data);
    } catch (e) {
      toast.error('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVoucher)
      });
      if (res.ok) {
        toast.success('Voucher created');
        setNewVoucher({ code: '', discountType: 'percentage', discountValue: '', minOrderValue: 0 });
        fetchVouchers();
      }
    } catch (e) {
      toast.error('Failed to create voucher');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this voucher?')) return;
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success('Voucher deleted');
        fetchVouchers();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Discount Vouchers</h1>
        <p>Create and manage promo codes for your customers.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.formCard}>
          <h2>Create New Voucher</h2>
          <form onSubmit={handleCreate}>
            <div className={styles.field}>
              <label>Promo Code</label>
              <input 
                type="text" 
                placeholder="e.g. WELCOME10"
                value={newVoucher.code}
                onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Type</label>
              <select 
                value={newVoucher.discountType}
                onChange={(e) => setNewVoucher({...newVoucher, discountType: e.target.value})}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Value</label>
              <input 
                type="number" 
                placeholder="e.g. 10"
                value={newVoucher.discountValue}
                onChange={(e) => setNewVoucher({...newVoucher, discountValue: e.target.value})}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Min. Order Amount (Optional)</label>
              <input 
                type="number" 
                placeholder="e.g. 1000"
                value={newVoucher.minOrderValue}
                onChange={(e) => setNewVoucher({...newVoucher, minOrderValue: e.target.value})}
              />
            </div>
            <button type="submit" className={styles.submitBtn}>Create Voucher</button>
          </form>
        </div>

        <div className={styles.listCard}>
          <h2>Active Vouchers</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Spend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.code}</strong></td>
                  <td>{v.discountType === 'percentage' ? `${v.discountValue}%` : `Rs. ${v.discountValue}`}</td>
                  <td>Rs. {v.minOrderValue || 0}</td>
                  <td>
                    <button onClick={() => handleDelete(v.id)} className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
