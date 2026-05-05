"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../lib/CartContext';
import styles from './page.module.css';
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
    city: 'Kathmandu',
    street: ''
  });
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
      <div className={`container ${styles.checkoutContainer}`} style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ 
          width: '40px', height: '40px', border: '3px solid #e8dfe0', borderTopColor: 'var(--primary-pink)',
          borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#94a3b8' }}>Preparing checkout...</p>
      </div>
    );
  }

  // Not logged in — show sign-in gate
  if (!user) {
    return (
      <div className={`container ${styles.checkoutContainer}`} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ 
          maxWidth: '460px', margin: '0 auto', background: 'white', padding: '50px 40px', 
          borderRadius: '16px', border: '1px solid var(--border-light)', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '10px', fontWeight: '600' }}>Sign in to Checkout</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6' }}>
            Please sign in or create an account to complete your purchase. This helps us track your orders and provide a better experience.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              href="/login" 
              style={{ 
                display: 'block', padding: '14px', background: 'linear-gradient(135deg, var(--primary-pink), var(--primary-pink-hover))',
                color: 'white', borderRadius: '10px', fontWeight: '600', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(242, 182, 193, 0.35)', transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              style={{ 
                display: 'block', padding: '14px', background: 'transparent', color: 'var(--text-color)',
                borderRadius: '10px', fontWeight: '500', textDecoration: 'none',
                border: '1.5px solid #e8dfe0', transition: 'all 0.3s ease'
              }}
            >
              Create an Account
            </Link>
          </div>
          <p style={{ marginTop: '24px', fontSize: '0.85em', color: '#c0aeb2' }}>
            Your cart items will be saved while you sign in.
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={`container ${styles.checkoutContainer}`}>
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add items to checkout.</p>
        <Link href="/shop" className={styles.primaryBtn} style={{display: 'inline-block', marginTop: '20px'}}>Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className={`container ${styles.checkoutContainer}`}>
      <h1 className={styles.pageTitle}>Checkout</h1>
      
      <div className={styles.layout}>
        {/* Left Side: Forms & Map */}
        <div className={styles.mainContent}>
          
          {/* Contact Info */}
          <section className={styles.section}>
            <h2>Contact Information</h2>
            <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
              <input type="text" placeholder="First Name" required className={styles.inputField} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input type="text" placeholder="Last Name" required className={styles.inputField} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <input type="email" placeholder="Email Address" required className={styles.inputField} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <input type="tel" placeholder="Phone Number" required className={styles.inputField} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </section>

          {/* Delivery Details */}
          <section className={styles.section}>
            <h2>Delivery Details (Nepal)</h2>
            <p className={styles.subtext}>Enter your destination for premium doorstep delivery.</p>
            
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label>District / Zone</label>
                <select 
                  className={styles.inputField} 
                  value={selectedZone?.id} 
                  onChange={e => setSelectedZone(shippingZones.find(z => z.id === e.target.value))}
                  required
                >
                  {shippingZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} (Rs. {z.fee})</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label>Street Address</label>
                <input type="text" placeholder="Street Address / Landmark" required className={styles.inputField} value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className={styles.section}>
            <h2>Payment Method</h2>
            
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                />
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentTitle}>Cash on Delivery (COD)</span>
                  <span className={styles.paymentDesc}>Pay with cash upon delivery.</span>
                </div>
              </label>

              <label className={`${styles.paymentOption} ${paymentMethod === 'qr' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="qr" 
                  checked={paymentMethod === 'qr'} 
                  onChange={() => setPaymentMethod('qr')} 
                />
                <div className={styles.paymentInfo}>
                  <span className={styles.paymentTitle}>Pay via Merchant QR</span>
                  <span className={styles.paymentDesc}>Scan our QR code (eSewa/Fonepay)</span>
                </div>
              </label>
            </div>

            {/* Conditional QR Display */}
            {paymentMethod === 'qr' && (
              <div className={styles.qrDisplay}>
                <p>Scan the QR below to pay <strong>Rs. {finalTotal}</strong></p>
                <div className={styles.qrPlaceholder} style={{ 
                  backgroundColor: '#f1f5f9', 
                  border: '2px dashed #cbd5e1', 
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px',
                  gap: '12px'
                }}>
                  <img 
                    src="/qr_code.png" 
                    alt="Merchant QR Code" 
                    style={{ width: '220px', height: 'auto', borderRadius: '8px' }} 
                  />
                  <span style={{ color: '#64748b', fontWeight: '600', fontSize: '1rem', marginTop: '10px' }}>Beauty Bees Cosmetics Merchant QR</span>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Scan to pay via eSewa / Fonepay</p>
                </div>
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Upload Payment Screenshot</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    required
                    style={{ width: '100%' }}
                  />
                  {paymentScreenshotBase64 && (
                    <div style={{ marginTop: '10px', color: '#16a34a', fontSize: '0.9em', fontWeight: '500' }}>Screenshot attached ✓</div>
                  )}
                </div>
              </div>
            )}
          </section>

          <button 
            className={styles.primaryBtn} 
            disabled={cartItems.length === 0}
            onClick={async () => {
              // 1. Submit order to Live API
              try {
                if (paymentMethod === 'qr' && !paymentScreenshotBase64) {
                  alert("Please upload a screenshot of your payment receipt.");
                  return;
                }
                const orderData = {
                  customer: `${formData.firstName} ${formData.lastName}`.trim() || 'Guest User',
                  email: formData.email || 'guest@example.com',
                  location: `${selectedZone?.name}, ${formData.street}`,
                  paymentMethod: paymentMethod === 'qr' ? 'Paid (QR)' : 'Cash on Delivery',
                  paymentScreenshotBase64: paymentScreenshotBase64,
                  total: finalTotal,
                  discountAmount: discount,
                  discountCode: appliedVoucher?.code || null,
                  shippingFee: shippingFee,
                  items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity || 1 }))
                };
                
                await fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(orderData)
                });
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
            }}
          >
            Confirm Order
          </button>
        </div>

        {/* Right Side: Order Summary */}
        <aside className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>
            
            <div className={styles.itemsList}>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.summaryItem}>
                  <div className={styles.itemImageWrap}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>Rs. {item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.voucherArea}>
              <input 
                type="text" 
                placeholder="Discount Code" 
                value={voucherCode} 
                onChange={e => setVoucherCode(e.target.value)}
                disabled={appliedVoucher}
              />
              <button onClick={applyVoucher} disabled={appliedVoucher || checkingVoucher}>
                {appliedVoucher ? 'Applied' : 'Apply'}
              </button>
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping ({selectedZone?.name})</span>
                <span style={{ color: shippingFee === 0 ? '#16a34a' : 'inherit', fontWeight: shippingFee === 0 ? '600' : 'normal' }}>
                  {shippingFee === 0 ? 'Free' : `Rs. ${shippingFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Discount ({appliedVoucher?.code})</span>
                  <span>- Rs. {discount}</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.finalTotalRow}`}>
                <span>Total Amount</span>
                <span>Rs. {finalTotal}</span>
              </div>
            </div>

            <CheckoutCrossSell />
          </div>
        </aside>
      </div>
    </div>
  );
}
