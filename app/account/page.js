"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

function AccountPageContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orderFilter, setOrderFilter] = useState('All');
  
  // Wishlist & Cancellation states
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  
  // Profile edit states
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', mfaEnabled: false, currentPassword: '', newPassword: '' });
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const fetchWishlist = async () => {
    setWishlistLoading(true);
    try {
      const res = await fetch('/api/user/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchMyOrders = async (email) => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      const myOrders = data.filter(o => o.email === email);
      setOrders(myOrders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      fetchMyOrders(data.user.email);
      fetchWishlist();
    } catch (e) {
      router.push('/login');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (activeTab === 'wishlist' && user) {
      fetchWishlist();
    }
  }, [activeTab, user]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileData({ ...profileData, name: user.name, phone: user.phone || '', mfaEnabled: !!user.mfaEnabled });
    }
  }, [user]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Profile updated successfully!');
        setUser(data.user);
        setEditMode(false);
        setProfileData({ ...profileData, currentPassword: '', newPassword: '' });
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm">
          <div className="text-center pb-6 border-b border-bb-border/10">
            <div className="w-20 h-20 rounded-full bg-slate-100 animate-pulse mx-auto mb-4"></div>
            <div className="w-32 h-6 bg-slate-100 animate-pulse mx-auto mb-2"></div>
            <div className="w-40 h-4 bg-slate-100 animate-pulse mx-auto"></div>
          </div>
          <div className="flex flex-col gap-3 mt-6">
            {[1,2,3,4].map(i => <div key={i} className="h-11 bg-slate-100 animate-pulse rounded-xl"></div>)}
          </div>
        </aside>
        <main className="flex-1 space-y-6">
          <div className="w-72 h-10 bg-slate-100 animate-pulse rounded-lg"></div>
          <div className="w-52 h-6 bg-slate-100 animate-pulse rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl"></div>)}
          </div>
          <div className="w-full h-80 bg-slate-100 animate-pulse rounded-2xl"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 pb-24 lg:pb-8">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm h-fit">
        <div className="text-center pb-6 border-b border-bb-border/10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-bb-pink text-white font-bold flex items-center justify-center text-2xl mb-3 shadow-sm">
            {(user?.name || 'C').charAt(0).toUpperCase()}
          </div>
          <h3 className="font-heading font-bold text-bb-heading text-base leading-tight mb-1">{user?.name || 'Customer'}</h3>
          <p className="text-slate-400 text-xs truncate w-full">{user?.email}</p>
        </div>
        <nav className="flex flex-col gap-1.5 mt-6">
          <button 
            className={cn(
              "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-none bg-transparent cursor-pointer",
              activeTab === 'overview' ? "bg-bb-pink text-white shadow-sm" : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
            )}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dashboard
          </button>
          <button 
            className={cn(
              "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-none bg-transparent cursor-pointer",
              activeTab === 'orders' ? "bg-bb-pink text-white shadow-sm" : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
            )}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            My Orders
          </button>
          <button 
            className={cn(
              "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-none bg-transparent cursor-pointer",
              activeTab === 'wishlist' ? "bg-bb-pink text-white shadow-sm" : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
            )}
            onClick={() => setActiveTab('wishlist')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Wishlist
          </button>
          <button 
            className={cn(
              "w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-none bg-transparent cursor-pointer",
              activeTab === 'settings' ? "bg-bb-pink text-white shadow-sm" : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
            )}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Account Settings
          </button>
          {user?.role === 'admin' && (
            <Link 
              href="/admin/dashboard" 
              className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink no-underline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Panel
            </Link>
          )}
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-none bg-transparent cursor-pointer text-red-500 hover:bg-red-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-bb-border/40 py-2.5 px-4 flex items-center justify-around z-[99] shadow-[0_-4px_15px_rgba(0,0,0,0.06)]">
        <button 
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold bg-transparent border-none cursor-pointer",
            activeTab === 'overview' ? "text-bb-pink" : "text-slate-400"
          )}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Home</span>
        </button>
        <button 
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold bg-transparent border-none cursor-pointer",
            activeTab === 'orders' ? "text-bb-pink" : "text-slate-400"
          )}
          onClick={() => setActiveTab('orders')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <span>Orders</span>
        </button>
        <button 
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold bg-transparent border-none cursor-pointer",
            activeTab === 'wishlist' ? "text-bb-pink" : "text-slate-400"
          )}
          onClick={() => setActiveTab('wishlist')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Wishlist</span>
        </button>
        <button 
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-semibold bg-transparent border-none cursor-pointer",
            activeTab === 'settings' ? "text-bb-pink" : "text-slate-400"
          )}
          onClick={() => setActiveTab('settings')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2-2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </button>
        <button 
          onClick={handleLogout} 
          className="flex flex-col items-center gap-1 text-[10px] font-semibold bg-transparent border-none cursor-pointer text-slate-400 hover:text-red-500"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {activeTab === 'overview' && (
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-slate-400 text-sm">Here&apos;s what&apos;s happening with your account today.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-bb-peach/30 border border-bb-border/20 rounded-2xl p-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bb-pink">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Orders</h4>
                  <p className="text-2xl font-bold text-bb-heading">{orders.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-bb-peach/30 border border-bb-border/20 rounded-2xl p-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bb-pink">
                  <rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">In Transit</h4>
                  <p className="text-2xl font-bold text-bb-heading">{orders.filter(o => o.status === 'Shipped').length}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-bb-border/10 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading text-lg font-bold text-bb-heading">Recent Order</h2>
                {orders.length > 0 && (
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-bb-pink hover:underline bg-transparent border-none cursor-pointer">
                    View All
                  </button>
                )}
              </div>
              
              {orders.length > 0 ? (
                <div className={cn(
                  "bg-white border border-bb-border/40 rounded-2xl p-5 shadow-sm",
                  orders[0].status === 'Cancelled' && "opacity-75 bg-slate-50"
                )}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bb-border/10 pb-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                        <img src={orders[0].items[0]?.image || '/logo_fixed.png'} alt="Order item" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-bb-heading">Order #{orders[0].id}</span>
                        <span className="text-xs text-slate-400">{new Date(orders[0].date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-3 py-1 rounded-full w-fit uppercase tracking-wider",
                      orders[0].status === 'Pending' && "bg-amber-50 text-amber-700",
                      orders[0].status === 'Shipped' && "bg-blue-50 text-blue-700",
                      orders[0].status === 'Delivered' && "bg-green-50 text-green-700",
                      orders[0].status === 'Cancelled' && "bg-red-50 text-red-700"
                    )}>
                      {orders[0].status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-bb-text">Total: <strong className="text-bb-heading">Rs. {orders[0].total.toLocaleString()}</strong></p>
                    <button 
                      className="bg-bb-heading hover:bg-bb-text text-white text-xs font-bold px-4 py-2 rounded-xl border-none cursor-pointer shadow-sm transition-colors" 
                      onClick={() => setActiveTab('orders')}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white border border-bb-border/20 rounded-2xl">
                  <p className="text-slate-500 text-sm mb-4">No orders yet. Ready to start shopping?</p>
                  <Link href="/shop" className="inline-block bg-bb-pink text-white font-bold text-xs px-6 py-2.5 rounded-xl no-underline hover:bg-bb-pink-hover shadow-sm transition-colors">
                    Explore Shop
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Order History</h1>
              <p className="text-slate-400 text-sm">Track and manage your previous purchases.</p>
            </div>
            
            {/* Filter Tabs scrollbar */}
            <div className="overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin">
              <div className="flex gap-2 w-max">
                {['All', 'To Ship', 'To Receive', 'To Review', 'Returns', 'Cancelled'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setOrderFilter(tab)} 
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold border transition-all border-none bg-transparent cursor-pointer",
                      orderFilter === tab 
                        ? "bg-bb-pink text-white shadow-sm" 
                        : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-slate-500 text-sm mb-4">No orders found in this category.</p>
                <Link href="/shop" className="inline-block bg-bb-heading text-white font-bold text-xs px-6 py-2.5 rounded-xl no-underline hover:bg-bb-text transition-colors">Continue Shopping</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders
                  .filter(o => {
                    if (orderFilter === 'All') return true;
                    if (orderFilter === 'To Ship') return o.status === 'Pending';
                    if (orderFilter === 'To Receive') return o.status === 'Shipped';
                    if (orderFilter === 'To Review') return o.status === 'Delivered';
                    if (orderFilter === 'Returns') return o.status === 'Returned';
                    if (orderFilter === 'Cancelled') return o.status === 'Cancelled';
                    return true;
                  })
                  .map(order => (
                  <div key={order.id} className={cn(
                    "bg-white border border-bb-border/40 rounded-2xl p-5 shadow-sm flex flex-col gap-4",
                    order.status === 'Cancelled' && "opacity-75 bg-slate-50"
                  )}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bb-border/10 pb-4">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Order ID</span>
                          <span className="text-sm font-semibold text-bb-heading">#{order.id}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                          <span className="text-sm font-semibold text-bb-text">{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                          <span className="text-sm font-bold text-bb-pink">Rs. {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-bold px-3 py-1 rounded-full w-fit uppercase tracking-wider",
                        order.status === 'Pending' && "bg-amber-50 text-amber-700",
                        order.status === 'Shipped' && "bg-blue-50 text-blue-700",
                        order.status === 'Delivered' && "bg-green-50 text-green-700",
                        order.status === 'Cancelled' && "bg-red-50 text-red-700"
                      )}>
                         {order.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                            <img src={item.image || '/logo_new.png'} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-bb-heading truncate block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end border-t border-bb-border/10 pt-4">
                       {order.status === 'Pending' && (
                         cancellingOrderId === order.id ? (
                           <div className="w-full flex flex-col gap-2.5 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-left">
                             <label className="text-xs font-semibold text-bb-heading">Reason for cancellation request:</label>
                             <textarea
                               value={cancelReason}
                               onChange={(e) => setCancelReason(e.target.value)}
                               placeholder="Please explain why you wish to cancel this order..."
                               className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-bb-text outline-none focus:border-bb-pink transition-all h-20 resize-none"
                             />
                             <div className="flex gap-2 justify-end">
                               <button
                                 disabled={submittingCancel}
                                 onClick={async () => {
                                   if (!cancelReason.trim()) {
                                     toast.error('Please enter a reason for cancellation');
                                     return;
                                   }
                                   setSubmittingCancel(true);
                                   try {
                                     const res = await fetch('/api/user/orders/cancel', {
                                       method: 'POST',
                                       headers: { 'Content-Type': 'application/json' },
                                       body: JSON.stringify({ orderId: order.id, reason: cancelReason })
                                     });
                                     if (res.ok) {
                                       toast.success('Cancellation request submitted!');
                                       setCancellingOrderId(null);
                                       setCancelReason('');
                                     } else {
                                       const data = await res.json();
                                       toast.error(data.error || 'Failed to submit request');
                                     }
                                   } catch (e) {
                                     toast.error('Connection error');
                                   } finally {
                                     setSubmittingCancel(false);
                                   }
                                 }}
                                 className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl border-none cursor-pointer shadow-sm transition-colors disabled:opacity-50"
                               >
                                 {submittingCancel ? 'Submitting...' : 'Submit Request'}
                               </button>
                               <button
                                 onClick={() => { setCancellingOrderId(null); setCancelReason(''); }}
                                 className="bg-white border border-slate-200 text-bb-text hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors"
                               >
                                 Cancel
                               </button>
                             </div>
                           </div>
                         ) : (
                           <button 
                            className="bg-transparent border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors" 
                            onClick={() => setCancellingOrderId(order.id)}
                           >
                            Request Cancellation
                           </button>
                         )
                       )}
                       {order.status === 'Delivered' && (
                         <Link href={`/products/${order.items[0]?.productId}`} className="bg-bb-pink hover:bg-bb-pink-hover text-white text-xs font-bold px-4 py-2 rounded-xl no-underline shadow-sm transition-colors">
                           Leave Review
                         </Link>
                       )}
                       {(order.status === 'Shipped' || order.status === 'Processing') && (
                         <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold select-none">🔒 Shipping</span>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Account Settings</h1>
              <p className="text-slate-400 text-sm">Manage your profile and personal details.</p>
            </div>
            
            <form className="flex flex-col gap-4" onSubmit={handleProfileUpdate}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!editMode} 
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all disabled:opacity-75"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email} 
                  disabled 
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text opacity-75 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Phone Number</label>
                <input 
                  type="tel" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!editMode} 
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all disabled:opacity-75"
                />
              </div>

              <div className="flex justify-between items-center p-4 bg-bb-peach/30 border border-bb-border/20 rounded-2xl mt-2">
                <div className="flex flex-col gap-0.5">
                  <strong className="text-sm font-semibold text-bb-heading">Multi-Factor Authentication (MFA)</strong>
                  <p className="text-xs text-slate-500">Secure your account with an email code during login.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profileData.mfaEnabled} 
                  onChange={(e) => setProfileData({...profileData, mfaEnabled: e.target.checked})}
                  disabled={!editMode}
                  className="accent-bb-pink w-5 h-5 cursor-pointer disabled:cursor-default"
                />
              </div>

              {editMode && (
                <div className="border-t border-bb-border/10 pt-4 flex flex-col gap-4 mt-2">
                  <h3 className="font-heading font-semibold text-bb-heading text-sm">Change Password</h3>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-bb-text">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                      className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-bb-text">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password (optional)"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                      className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4">
                {editMode ? (
                  <div className="flex gap-2">
                    <button type="submit" disabled={updating} className="bg-bb-pink hover:bg-bb-pink-hover text-white text-sm font-semibold px-6 py-2.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors disabled:opacity-50">
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="bg-white border border-bb-border text-bb-text hover:bg-bb-bg text-sm font-semibold px-6 py-2.5 rounded-xl cursor-pointer transition-colors" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" className="bg-bb-heading hover:bg-bb-text text-white text-sm font-semibold px-6 py-2.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {activeTab === 'wishlist' && (
          <section className="bg-white border border-bb-border/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div>
              <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">My Wishlist</h1>
              <p className="text-slate-400 text-sm">Products you have saved for later.</p>
            </div>
            
            {wishlistLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-6 h-6 border-2 border-bb-pink border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💖</div>
                <p className="text-slate-500 text-sm mb-4">Your wishlist is empty.</p>
                <Link href="/shop" className="inline-block bg-bb-heading text-white font-bold text-xs px-6 py-2.5 rounded-xl no-underline hover:bg-bb-text transition-colors">
                  Explore Shop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {wishlist.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  );
}
