"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function AccountPageContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [orderFilter, setOrderFilter] = useState('All');
  
  // Profile edit states
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', mfaEnabled: false, currentPassword: '', newPassword: '' });
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

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
    } catch (e) {
      router.push('/login');
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
      <div className={`container ${styles.accountPage}`}>
        <aside className={styles.sidebar}>
          <div className={styles.userProfile}>
            <div className={`${styles.skeletonCircle}`} style={{ width: '80px', height: '80px', margin: '0 auto 15px' }}></div>
            <div className={styles.skeleton} style={{ width: '120px', height: '24px', marginBottom: '8px' }}></div>
            <div className={styles.skeleton} style={{ width: '180px', height: '16px' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            {[1,2,3,4].map(i => <div key={i} className={styles.skeleton} style={{ height: '44px', borderRadius: '12px' }}></div>)}
          </div>
        </aside>
        <main className={styles.mainContent}>
          <div className={styles.skeleton} style={{ width: '300px', height: '48px', marginBottom: '8px' }}></div>
          <div className={styles.skeleton} style={{ width: '200px', height: '24px', marginBottom: '40px' }}></div>
          <div className={styles.statsGrid}>
            {[1,2].map(i => <div key={i} className={styles.skeleton} style={{ flex: '1', height: '100px', borderRadius: '20px' }}></div>)}
          </div>
          <div className={styles.skeleton} style={{ width: '100%', height: '300px', borderRadius: '24px' }}></div>
        </main>
      </div>
    );
  }

  return (
    <div className={`container ${styles.accountPage}`}>
      <aside className={styles.sidebar}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {(user?.name || 'C').charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name || 'Customer'}</h3>
          <p>{user?.email}</p>
        </div>
        <nav className={styles.sideNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dashboard
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            My Orders
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Account Settings
          </button>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className={styles.navItem}>
              <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className={styles.logoutNavItem}>
            <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileBottomNav}>
        <button 
          className={`${styles.bottomNavItem} ${activeTab === 'overview' ? styles.bottomActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg className={styles.bottomIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Home</span>
        </button>
        <button 
          className={`${styles.bottomNavItem} ${activeTab === 'orders' ? styles.bottomActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <svg className={styles.bottomIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          <span>Orders</span>
        </button>
        <button 
          className={`${styles.bottomNavItem} ${activeTab === 'settings' ? styles.bottomActive : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg className={styles.bottomIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </button>
        <button onClick={handleLogout} className={styles.bottomNavItem}>
          <svg className={styles.bottomIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Logout</span>
        </button>
      </nav>

      <main className={styles.mainContent}>
        {activeTab === 'overview' && (
          <section className={styles.tabSection}>
            <h1 className={styles.sectionTitle}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className={styles.subtitle}>Here's what's happening with your account today.</p>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.statIconLine}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <div className={styles.statInfo}>
                  <h4>Total Orders</h4>
                  <p>{orders.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.statIconLine}>
                  <rect x="1" y="3" width="15" height="13"/><polyline points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <div className={styles.statInfo}>
                  <h4>In Transit</h4>
                  <p>{orders.filter(o => o.status === 'Shipped').length}</p>
                </div>
              </div>
            </div>

            <div className={styles.recentOrders}>
              <div className={styles.recentHeader}>
                <h2>Recent Order</h2>
                {orders.length > 0 && <button onClick={() => setActiveTab('orders')} className={styles.viewAll}>View All</button>}
              </div>
              
              {orders.length > 0 ? (
                <div key={orders[0].id} className={`${styles.orderCard} ${orders[0].status === 'Cancelled' ? styles.cancelled : ''}`}>
                  <div className={styles.orderCardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div className={styles.orderThumb}>
                        <img src={orders[0].items[0]?.image || '/logo_fixed.png'} alt="Order item" />
                      </div>
                      <div className={styles.orderMeta}>
                        <span className={styles.orderId}>Order #{orders[0].id}</span>
                        <span className={styles.orderDate}>{new Date(orders[0].date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[orders[0].status?.toLowerCase()]}`}>
                      {orders[0].status}
                    </span>
                  </div>
                  <div className={styles.orderCardBody}>
                    <p className={styles.orderTotal}>Total: <strong>Rs. {orders[0].total.toLocaleString()}</strong></p>
                  </div>
                  <div className={styles.orderCardFooter}>
                    <button className={styles.viewOrderBtn} onClick={() => setActiveTab('orders')}>View Details</button>
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>No orders yet. Ready to start shopping?</p>
                  <Link href="/shop" className={styles.shopBtn}>Explore Shop</Link>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className={styles.tabSection}>
            <h1 className={styles.sectionTitle}>Order History</h1>
            <p className={styles.subtitle}>Track and manage your previous purchases.</p>
            
            <div className={styles.orderTabsWrapper}>
              <div className={styles.orderTabs}>
                {['All', 'To Ship', 'To Receive', 'To Review', 'Returns', 'Cancelled'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setOrderFilter(tab)} 
                    className={orderFilter === tab ? styles.orderTabBtnActive : styles.orderTabBtn}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <p>No orders found in this category.</p>
                <Link href="/shop" className={styles.shopBtn}>Continue Shopping</Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
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
                  <div key={order.id} className={`${styles.fullOrderCard} ${order.status === 'Cancelled' ? styles.cancelled : ''}`}>
                    <div className={styles.cardHeader}>
                      <div className={styles.orderHeaderTop}>
                        <div className={styles.idGroup}>
                          <span className={styles.idLabel}>Order ID</span>
                          <span className={styles.idValue}>#{order.id}</span>
                        </div>
                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || styles.pending}`}>
                           {order.status}
                        </span>
                      </div>
                      
                      <div className={styles.orderHeaderBottom}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Date</span>
                          <span className={styles.metaValue}>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Total</span>
                          <span className={styles.metaValue}>Rs. {order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className={styles.actionGroup}>
                         {order.status === 'Pending' && (
                           <button 
                            className={styles.cancelOrderBtn} 
                            onClick={async () => {
                              if (!confirm('Are you sure you want to cancel this order?')) return;
                              const res = await fetch('/api/user/orders/cancel', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderId: order.id })
                              });
                              if (res.ok) {
                                toast.success('Order cancelled');
                                fetchMyOrders(user.email);
                              } else {
                                toast.error('Cancellation failed. Order might already be shipping.');
                              }
                            }}
                           >
                            Cancel Order
                           </button>
                         )}
                         {order.status === 'Delivered' && (
                           <Link href={`/products/${order.items[0]?.productId}`} className={styles.reviewBtn}>Leave Review</Link>
                         )}
                         {(order.status === 'Shipped' || order.status === 'Processing') && (
                           <span className={styles.lockHint}>🔒 Shipping</span>
                         )}
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <div className={styles.itemsList}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            <div className={styles.itemThumbSmall}>
                              <img src={item.image || '/logo_fixed.png'} alt={item.name} />
                            </div>
                            <div className={styles.itemDetails}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemQty}>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className={styles.tabSection}>
            <h1 className={styles.sectionTitle}>Account Settings</h1>
            <p className={styles.subtitle}>Manage your profile and personal details.</p>
            
            <form className={styles.settingsForm} onSubmit={handleProfileUpdate}>
              <div className={styles.fieldGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  disabled={!editMode} 
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Email Address</label>
                <input type="email" defaultValue={user?.email} disabled />
              </div>
              <div className={styles.fieldGroup}>
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  disabled={!editMode} 
                />
              </div>

              <div className={styles.mfaToggle}>
                <div className={styles.mfaInfo}>
                  <strong>Multi-Factor Authentication (MFA)</strong>
                  <p>Secure your account with an email code during login.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profileData.mfaEnabled} 
                  onChange={(e) => setProfileData({...profileData, mfaEnabled: e.target.checked})}
                  disabled={!editMode}
                />
              </div>

              {editMode && (
                <>
                  <div className={styles.divider}></div>
                  <h3 style={{ marginBottom: '15px' }}>Change Password</h3>
                  <div className={styles.fieldGroup}>
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter current password"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password (optional)"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className={styles.formActions}>
                {editMode ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className={styles.saveBtn} disabled={updating}>
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className={styles.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
              </div>
            </form>
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
