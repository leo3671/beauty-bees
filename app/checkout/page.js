"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../lib/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CheckoutCrossSell from '../../components/CheckoutCrossSell';

export default function Checkout() {
  const { cartItems = [], setCartItems } = useCart() || {};
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    area: '',
    landmark: '',
    city: 'Kathmandu',
    deliveryRemarks: ''
  });

  const handleSubmitOrder = async () => {
    // 1. Submit order to Live API
    try {
      if (paymentMethod === 'qr' && !paymentScreenshotBase64) {
        alert("Please upload a screenshot of your payment receipt.");
        return;
      }
      const orderData = {
        customer: `${formData.firstName} ${formData.lastName}`.trim() || 'Guest User',
        email: formData.email || 'guest@example.com',
        location: `${selectedZone?.name}, ${formData.city}, ${formData.area}, ${formData.landmark}`,
        deliveryRemarks: formData.deliveryRemarks,
        paymentMethod: paymentMethod === 'qr' ? 'Paid (QR)' : 'Cash on Delivery',
        paymentScreenshotBase64: paymentScreenshotBase64,
        total: finalTotal,
        discountAmount: discount,
        discountCode: appliedVoucher?.code || null,
        shippingFee: shippingFee,
        items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity || 1 }))
      };
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error("Order submission failed");
    } catch (e) {
      console.error("Could not place order", e);
      alert("Failed to place order. Please try again.");
      return;
    }

    // 2. Save purchased categories and brands to local storage
    try {
      const existingHistoryStr = localStorage.getItem('beautyBees_history');
      let history = existingHistoryStr ? JSON.parse(existingHistoryStr) : { categories: [], brands: [], productIds: [] };
      
      cartItems.forEach(item => {
        if (!history.categories.includes(item.category)) history.categories.push(item.category);
        if (!history.brands.includes(item.brand)) history.brands.push(item.brand);
        if (!history.productIds.includes(item.id)) history.productIds.push(item.id);
      });
      
      localStorage.setItem('beautyBees_history', JSON.stringify(history));
    } catch (e) {
      console.error("Could not save order history", e);
    }

    // 3. Clear cart and show success
    toast.success('Order Placed Successfully!', { duration: 5000 });
    if (setCartItems) {
      setCartItems([]);
    }
    setTimeout(() => {
      window.location.href = '/checkout/success';
    }, 2000);
  };
  const [paymentScreenshotBase64, setPaymentScreenshotBase64] = useState('');
  const [shippingZones, setShippingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [checkingVoucher, setCheckingVoucher] = useState(false);

  useEffect(() => {
    fetch('/api/admin/shipping')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setShippingZones(data);
          if (data.length > 0) setSelectedZone(data[0]);
        }
      });
  }, []);

  const applyVoucher = async () => {
    if (!voucherCode) return;
    setCheckingVoucher(true);
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      const voucher = data.find(v => v.code === voucherCode.toUpperCase() && v.isActive);
      
      if (voucher) {
        if (subtotal < voucher.minOrderValue) {
          toast.error(`Minimum order value of Rs. ${voucher.minOrderValue} required.`);
        } else {
          setAppliedVoucher(voucher);
          const amt = voucher.discountType === 'percentage' 
            ? (subtotal * voucher.discountValue / 100)
            : voucher.discountValue;
          setDiscount(amt);
          toast.success('Voucher applied!');
        }
      } else {
        toast.error('Invalid or expired voucher code');
      }
    } catch (e) {
      toast.error('Error applying voucher');
    } finally {
      setCheckingVoucher(false);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          // Auto-fill email from session
          setFormData(prev => ({ ...prev, email: data.email || '' }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const isFreeShipping = subtotal >= 10000;
  const shippingFee = (selectedZone && !isFreeShipping) ? selectedZone.fee : 0;
  const finalTotal = subtotal + shippingFee - discount;

  // Loading state
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="inline-block w-8 h-8 border-4 border-bb-pink border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Preparing checkout...</p>
      </div>
    );
  }

  // Not logged in — show sign-in gate
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="max-w-[460px] w-full bg-white p-8 md:p-12 rounded-2xl border border-bb-border/30 shadow-md text-center">
          <div className="text-5xl mb-6">🔒</div>
          <h2 className="font-heading text-2xl font-bold text-bb-heading mb-3">Sign in to Checkout</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Please sign in or create an account to complete your purchase. This helps us track your orders and provide a better experience.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/login" 
              className="block w-full py-3.5 bg-bb-pink text-white rounded-xl font-semibold text-center no-underline shadow-md hover:bg-bb-pink-hover transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="block w-full py-3.5 bg-white text-bb-text border border-bb-border rounded-xl font-medium text-center no-underline hover:bg-bb-bg transition-colors"
            >
              Create an Account
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Your cart items will be saved while you sign in.
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center bg-white border border-bb-border/30 rounded-2xl max-w-xl">
        <h2 className="font-heading text-2xl font-bold text-bb-heading mb-3">Checkout</h2>
        <p className="text-slate-500 text-sm mb-6">Your cart is empty. Please add items to checkout.</p>
        <Link href="/shop" className="inline-block bg-bb-heading text-white font-bold text-sm px-6 py-2.5 rounded-xl no-underline hover:bg-bb-text transition-colors">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="font-heading text-3xl font-bold text-bb-heading mb-8 border-b border-bb-border/20 pb-4">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 relative pb-20 lg:pb-0">
        {/* Left Side: Forms & Payment details */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Contact Info */}
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-bb-heading mb-4 pb-2 border-b border-bb-border/10">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="First Name" required className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input type="text" placeholder="Last Name" required className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <div className="mb-4">
              <input type="email" placeholder="Email Address" required inputMode="email" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <input type="tel" placeholder="Phone Number" required inputMode="tel" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </section>

          {/* Delivery Details */}
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-bb-heading mb-1">Delivery Details (Nepal)</h2>
            <p className="text-xs text-slate-400 mb-4">Enter your destination for premium doorstep delivery.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">District / Zone</label>
                <select 
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" 
                  value={selectedZone?.id} 
                  onChange={e => setSelectedZone(shippingZones.find(z => z.id === e.target.value))}
                  required
                >
                  {shippingZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} (Rs. {z.fee})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">City / Municipality</label>
                <input type="text" placeholder="e.g. Kathmandu" required className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Area / Tole</label>
                <input type="text" placeholder="e.g. New Baneshwor" required className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Landmark / House No.</label>
                <input type="text" placeholder="e.g. Near Civil Bank" required className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label className="text-xs font-semibold text-bb-text">Delivery Remarks / Instructions (Optional)</label>
              <textarea 
                placeholder="e.g. Near the big pipal tree, call before arriving, or gate color."
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all resize-none"
                value={formData.deliveryRemarks}
                onChange={e => setFormData({...formData, deliveryRemarks: e.target.value})}
                rows="3"
              ></textarea>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-bb-heading mb-4 pb-2 border-b border-bb-border/10">Payment Method</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border border-bb-border/40 cursor-pointer bg-white transition-all hover:bg-bb-peach/20",
                paymentMethod === 'cod' && "border-bb-pink bg-bb-peach/30 shadow-sm"
              )}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                  className="accent-bb-pink w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-bb-heading">Cash on Delivery (COD)</span>
                  <span className="text-xs text-slate-500">Pay with cash upon delivery.</span>
                </div>
              </label>

              <label className={cn(
                "flex items-center gap-3 p-4 rounded-xl border border-bb-border/40 cursor-pointer bg-white transition-all hover:bg-bb-peach/20",
                paymentMethod === 'qr' && "border-bb-pink bg-bb-peach/30 shadow-sm"
              )}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="qr" 
                  checked={paymentMethod === 'qr'} 
                  onChange={() => setPaymentMethod('qr')} 
                  className="accent-bb-pink w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-bb-heading">Pay via Merchant QR</span>
                  <span className="text-xs text-slate-500">Scan our QR code (eSewa/Fonepay)</span>
                </div>
              </label>
            </div>

            {/* Conditional QR Display */}
            {paymentMethod === 'qr' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-bb-text font-medium">Scan the QR below to pay <strong className="text-bb-pink">Rs. {finalTotal}</strong></p>
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 gap-2">
                  <img 
                    src="/qr_code.png" 
                    alt="Merchant QR Code" 
                    className="w-[200px] h-auto rounded-lg shadow-sm" 
                  />
                  <span className="text-bb-heading font-semibold text-sm mt-2">Beauty Bees Cosmetics Merchant QR</span>
                  <p className="text-slate-400 text-xs">Scan to pay via eSewa / Fonepay</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-sm font-bold mb-2">Upload Payment Screenshot</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    required
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-bb-pink file:text-white hover:file:bg-bb-pink-hover"
                  />
                  {paymentScreenshotBase64 && (
                    <div className="mt-2 text-green-600 text-xs font-semibold">Screenshot attached ✓</div>
                  )}
                </div>
              </div>
            )}
          </section>

          <CheckoutCrossSell />

          <button 
            className="w-full bg-bb-heading text-white hover:bg-bb-text font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-none cursor-pointer max-lg:hidden"
            disabled={cartItems.length === 0 || !formData.area}
            onClick={handleSubmitOrder}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Confirm Secure Order
          </button>
        </div>

        {/* Right Side: Order Summary */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm lg:sticky lg:top-24 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-bb-border/10">
              <h3 className="font-heading font-bold text-bb-heading text-lg">Order Summary</h3>
              <span className="text-xs bg-bb-peach text-bb-text font-semibold px-2.5 py-1 rounded-full">{cartItems.length} Items</span>
            </div>
            
            <div className="flex flex-col gap-4 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-bb-heading truncate block">{item.name}</span>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Qty: 1</span>
                      <span className="font-semibold text-bb-text">Rs. {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-bb-border/20 pt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="PROMO CODE" 
                className="flex-1 bg-bb-bg border border-bb-border/60 rounded-xl px-3 py-2 text-xs text-bb-text outline-none focus:border-bb-pink transition-all uppercase placeholder:normal-case"
                value={voucherCode} 
                onChange={e => setVoucherCode(e.target.value)}
                disabled={appliedVoucher}
              />
              <button 
                className="bg-bb-heading text-white font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer hover:bg-bb-text transition-colors disabled:opacity-50"
                onClick={applyVoucher} 
                disabled={appliedVoucher || checkingVoucher}
              >
                {appliedVoucher ? 'APPLIED' : 'APPLY'}
              </button>
            </div>

            <div className="border-t border-bb-border/20 pt-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs text-bb-text/80">
                <span>Subtotal</span>
                <span className="font-semibold text-bb-heading">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-bb-text/80">
                <span>Shipping ({selectedZone?.name || 'Standard'})</span>
                <span className={cn("font-semibold text-bb-heading", shippingFee === 0 && "text-green-600 uppercase font-bold text-[10px]")}>
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-xs text-green-600 font-semibold">
                  <span>Discount ({appliedVoucher?.code})</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold text-base text-bb-heading border-t border-bb-border/30 pt-4 mt-2">
                <span>Grand Total</span>
                <span className="text-lg text-bb-pink">Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="max-lg:hidden">
              <button 
                className="w-full bg-bb-heading text-white hover:bg-bb-text font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                disabled={cartItems.length === 0 || !formData.area}
                onClick={() => document.getElementById('mainConfirmBtn')?.click()}
              >
                Place Secure Order
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-bb-border/40 px-6 py-4 flex items-center justify-between z-50 lg:hidden shadow-[0_-4px_15px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Amount</span>
          <span className="text-base font-bold text-bb-pink">Rs. {finalTotal.toLocaleString()}</span>
        </div>
        <button 
          id="mainConfirmBtn"
          className="bg-bb-pink hover:bg-bb-pink-hover text-white font-bold text-sm px-6 py-3 rounded-xl border-none cursor-pointer shadow-sm transition-colors disabled:opacity-50"
          disabled={cartItems.length === 0 || !formData.area}
          onClick={handleSubmitOrder}
        >
          Confirm Secure Order
        </button>
      </div>
    </div>
  );
}
