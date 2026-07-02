"use client";

import { useState, useEffect } from 'react';
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

  async function fetchBrands() {
    try {
      const res = await fetch('/api/brands?all=true');
      const data = await res.json();
      setBrands(data);
    } catch (e) {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading brands...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-bb-heading">Brand Logos</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-bb-heading hover:bg-bb-text text-white text-sm font-bold px-4 py-2.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
        >
          + Add New Brand
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.isArray(brands) && brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-bb-heading">{brand.name}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleStatus(brand.id, brand.isActive)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-none cursor-pointer transition-colors",
                      brand.isActive 
                        ? "bg-green-50 text-green-700 hover:bg-green-100" 
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    )}
                  >
                    {brand.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(brand.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold bg-transparent border-none cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full border border-slate-100 shadow-xl flex flex-col gap-5">
            <h2 className="font-heading text-lg font-bold text-bb-heading">Add Brand</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Brand Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" placeholder="e.g. Anua" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Brand Logo</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-bb-pink file:text-white hover:file:bg-bb-pink-hover" />
                {formData.logo && <img src={formData.logo} alt="Preview" className="w-24 h-auto rounded-lg border border-slate-100 mt-2 object-contain bg-slate-50 p-1" />}
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-bb-text font-semibold py-2.5 rounded-xl transition-colors text-sm border-none cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-bb-pink hover:bg-bb-pink-hover text-white font-bold py-2.5 rounded-xl shadow-md transition-colors text-sm border-none cursor-pointer">
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
