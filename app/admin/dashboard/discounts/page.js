"use client";

import { useState, useEffect } from 'react';
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

  async function fetchVouchers() {
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      if (Array.isArray(data)) setVouchers(data);
    } catch (e) {
      toast.error('Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading discounts...</div>;

  return (
    <div className="max-w-6xl mx-auto py-4">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Discount Vouchers</h1>
        <p className="text-sm text-slate-500">Create and manage promo codes for your customers.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 h-fit">
          <h2 className="font-heading text-base font-bold text-bb-heading pb-2 border-b border-slate-100">Create New Voucher</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-bb-text">Promo Code</label>
              <input 
                type="text" 
                placeholder="e.g. WELCOME10"
                value={newVoucher.code}
                onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                required
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-bb-text">Type</label>
              <select 
                value={newVoucher.discountType}
                onChange={(e) => setNewVoucher({...newVoucher, discountType: e.target.value})}
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-bb-text">Value</label>
              <input 
                type="number" 
                placeholder="e.g. 10"
                value={newVoucher.discountValue}
                onChange={(e) => setNewVoucher({...newVoucher, discountValue: e.target.value})}
                required
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-bb-text">Min. Order Amount (Optional)</label>
              <input 
                type="number" 
                placeholder="e.g. 1000"
                value={newVoucher.minOrderValue}
                onChange={(e) => setNewVoucher({...newVoucher, minOrderValue: e.target.value})}
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-bb-heading hover:bg-bb-text text-white font-bold py-3.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors text-sm mt-2">
              Create Voucher
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <h2 className="font-heading text-base font-bold text-bb-heading pb-2 border-b border-slate-100">Active Vouchers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Spend</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vouchers.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-bb-heading">{v.code}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      {v.discountType === 'percentage' ? `${v.discountValue}%` : `Rs. ${v.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">Rs. {v.minOrderValue || 0}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold bg-transparent border-none cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
