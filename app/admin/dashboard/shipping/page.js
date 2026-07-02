"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function ShippingManagement() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newZone, setNewZone] = useState({ name: '', fee: '' });
  const [editingZone, setEditingZone] = useState(null);

  useEffect(() => {
    fetchZones();
  }, []);

  async function fetchZones() {
    try {
      const res = await fetch('/api/admin/shipping');
      const data = await res.json();
      if (Array.isArray(data)) setZones(data);
    } catch (e) {
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone)
      });
      if (res.ok) {
        toast.success('Zone created');
        setNewZone({ name: '', fee: '' });
        fetchZones();
      }
    } catch (e) {
      toast.error('Failed to create zone');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone)
      });
      if (res.ok) {
        toast.success('Zone updated');
        setEditingZone(null);
        fetchZones();
      }
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success('Zone deleted');
        fetchZones();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading shipping zones...</div>;

  return (
    <div className="max-w-6xl mx-auto py-4">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Shipping Zones</h1>
        <p className="text-sm text-slate-500">Pre-set shipping fees based on delivery districts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 h-fit">
          <h2 className="font-heading text-base font-bold text-bb-heading pb-2 border-b border-slate-100">{editingZone ? 'Edit Zone' : 'Add New Zone'}</h2>
          <form onSubmit={editingZone ? handleUpdate : handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-bb-text">District/Location Name</label>
              <input 
                type="text" 
                placeholder="e.g. Kathmandu"
                value={editingZone ? editingZone.name : newZone.name}
                onChange={(e) => editingZone ? setEditingZone({...editingZone, name: e.target.value}) : setNewZone({...newZone, name: e.target.value})}
                required
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-bb-text">Shipping Fee (Rs.)</label>
              <input 
                type="number" 
                placeholder="e.g. 100"
                value={editingZone ? editingZone.fee : newZone.fee}
                onChange={(e) => editingZone ? setEditingZone({...editingZone, fee: e.target.value}) : setNewZone({...newZone, fee: e.target.value})}
                required
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button type="submit" className="w-full bg-bb-heading hover:bg-bb-text text-white font-bold py-3.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors text-sm">
                {editingZone ? 'Update Zone' : 'Create Zone'}
              </button>
              {editingZone && (
                <button type="button" onClick={() => setEditingZone(null)} className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-bb-text font-semibold py-3 rounded-xl transition-colors text-sm border-none cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <h2 className="font-heading text-base font-bold text-bb-heading pb-2 border-b border-slate-100">Active Zones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zones.map(z => (
                  <tr key={z.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-bb-heading">{z.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">Rs. {z.fee}</td>
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => setEditingZone(z)} className="text-bb-heading hover:underline text-sm font-semibold bg-transparent border-none cursor-pointer mr-3">Edit</button>
                      <button onClick={() => handleDelete(z.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold bg-transparent border-none cursor-pointer">Delete</button>
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
