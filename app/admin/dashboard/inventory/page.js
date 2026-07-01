"use client";

import { useState, useEffect } from 'react';
import { useProducts } from '../../../../lib/ProductContext';
import { cn } from '@/lib/utils';

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

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading premium inventory...</div>;

  const brandList = Array.from(new Set([...dbBrands.map(b => b.name), ...products.map(p => p.brand)])).filter(b => b);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1">Product Catalog</h1>
          <p className="text-sm text-slate-500">Manage your inventory, pricing, and professional product photography.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-bb-heading hover:bg-bb-text text-white text-sm font-bold px-4 py-2.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
        >
          + Add New Product
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[2000] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-2xl w-full border border-slate-100 shadow-xl max-h-[90vh] overflow-y-auto flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-heading text-lg font-bold text-bb-heading">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowAddModal(false)} className="background-none border-none text-2xl cursor-pointer text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Heartleaf 77% Soothing Toner" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Brand</label>
                <select 
                  value={!formData.brand || !brandList.includes(formData.brand) ? 'Other' : formData.brand} 
                  onChange={e => setFormData({...formData, brand: e.target.value === 'Other' ? '' : e.target.value})} 
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
                >
                  <option value="" disabled>Select Brand</option>
                  {brandList.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                  <option value="Other">Custom Brand...</option>
                </select>
                {(!formData.brand || !brandList.includes(formData.brand)) && (
                  <input placeholder="Enter new brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all mt-2" />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Category</label>
                <select 
                  value={isCustomCategory ? 'Other' : formData.category} 
                  onChange={e => {
                    if (e.target.value === 'Other') { setIsCustomCategory(true); setFormData({...formData, category: ''}); }
                    else { setIsCustomCategory(false); setFormData({...formData, category: e.target.value}); }
                  }} 
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="Other">Custom Category...</option>
                </select>
                {isCustomCategory && (
                  <input placeholder="Enter category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all mt-2" />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Price (Rs.)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Stock Quantity</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Product Photography (Cloud Upload)</label>
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.imagePreview ? <img src={formData.imagePreview} className="w-full h-full object-cover" /> : <span className="text-slate-300 text-3xl">📷</span>}
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="imageUpload" />
                    <label htmlFor="imageUpload" className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer font-semibold text-xs text-slate-700 transition-colors border-none">Choose File</label>
                    <p className="text-[10px] text-slate-400 mt-1.5">High-res JPG or PNG with white background recommended.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all resize-none" rows="3" />
              </div>

              <div className="md:col-span-2 flex gap-3 border-t border-slate-100 pt-4 mt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-bb-text font-semibold py-3 rounded-xl transition-colors text-sm cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-bb-heading hover:bg-bb-text text-white font-bold py-3 rounded-xl shadow-md transition-colors text-sm border-none cursor-pointer">
                  {isSubmitting ? 'Processing Cloud Upload...' : 'Save Product & Update Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-100 bg-slate-50 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-bb-heading">{product.name}</div>
                      <div className="text-xs text-slate-400">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600">{product.brand}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-bb-heading">Rs. {product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                      <div 
                        className={cn("h-full", product.stock > 10 ? 'bg-green-500' : 'bg-red-500')} 
                        style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{product.stock || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEditClick(product)} className="text-bb-heading hover:bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors mr-2 bg-white">Edit</button>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:text-red-700 text-xs font-bold bg-transparent border-none cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
