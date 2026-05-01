"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AccountPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Profile edit states
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', mfaEnabled: false, currentPassword: '', newPassword: '' });
  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

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
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your account...</p>
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
            <span className={styles.icon}>🏠</span> Dashboard
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className={styles.icon}>📦</span> My Orders
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className={styles.icon}>⚙️</span> Account Settings
          </button>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className={styles.navItem}>
              <span className={styles.icon}>🛡️</span> Admin Panel
            </Link>
          )}
          <button onClick={handleLogout} className={styles.logoutNavItem}>
            <span className={styles.icon}>🚪</span> Logout
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'overview' && (
          <section className={styles.tabSection}>
            <h1 className={styles.sectionTitle}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className={styles.subtitle}>Here's what's happening with your account today.</p>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🛍️</span>
                <div className={styles.statInfo}>
                  <h4>Total Orders</h4>
                  <p>{orders.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🚛</span>
                <div className={styles.statInfo}>
                  <h4>In Transit</h4>
                  <p>{orders.filter(o => o.status === 'Shipped').length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>⭐</span>
                <div className={styles.statInfo}>
                  <h4>Loyalty Points</h4>
                  <p>150 pts</p>
                </div>
              </div>
            </div>

            <div className={styles.recentOrders}>
              <div className={styles.recentHeader}>
                <h2>Recent Order</h2>
                {orders.length > 0 && <button onClick={() => setActiveTab('orders')} className={styles.viewAll}>View All</button>}
              </div>
              
              {orders.length > 0 ? (
                <div className={styles.miniOrderCard}>
                  <div className={styles.miniHeader}>
                    <span className={styles.orderId}>{orders[0].id}</span>
                    <span className={styles.badge}>{orders[0].status}</span>
                  </div>
                  <div className={styles.miniItems}>
                    {orders[0].items.slice(0, 2).map((item, i) => (
                      <span key={i}>{item.name}{i < 1 && orders[0].items.length > 1 ? ', ' : ''}</span>
                    ))}
                    {orders[0].items.length > 2 && <span> +{orders[0].items.length - 2} more</span>}
                  </div>
                  <div className={styles.miniFooter}>
                    <span>{new Date(orders[0].date).toLocaleDateString()}</span>
                    <strong>Rs. {orders[0].total.toLocaleString()}</strong>
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
            
            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <p>You haven't placed any orders yet.</p>
                <Link href="/shop" className={styles.shopBtn}>Start Shopping</Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order.id} className={styles.fullOrderCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.idGroup}>
                        <span className={styles.idLabel}>Order ID</span>
                        <span className={styles.idValue}>{order.id}</span>
                      </div>
                      <div className={styles.metaGroup}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Date</span>
                          <span className={styles.metaValue}>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Total</span>
                          <span className={styles.metaValue}>Rs. {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={styles.badgeGroup}>
                         <span className={`${styles.statusBadge} ${order.status === 'Delivered' ? styles.delivered : styles.pending}`}>
                           {order.status}
                         </span>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.itemsScroll}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItemRow}>
                            <div className={styles.itemDot}></div>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemQty}>x{item.quantity}</span>
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
