"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './dashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user.role === 'admin' || data.user.role === 'superadmin') {
            setIsAdmin(true);
          } else {
            router.replace('/login');
          }
        } else {
          router.replace('/admin/login');
        }
      } catch (e) {
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f1f5f9' }}>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Beauty Bees</h2>
          <span>Admin Panel</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={`${styles.navLink} ${pathname === '/admin/dashboard' ? styles.active : ''}`}>
            Overview
          </Link>
          <Link href="/admin/dashboard/inventory" className={`${styles.navLink} ${pathname === '/admin/dashboard/inventory' ? styles.active : ''}`}>
            Inventory & Pricing
          </Link>
          <Link href="/admin/dashboard/users" className={`${styles.navLink} ${pathname === '/admin/dashboard/users' ? styles.active : ''}`}>
            User Management
          </Link>
          <Link href="/admin/dashboard/orders" className={`${styles.navLink} ${pathname === '/admin/dashboard/orders' ? styles.active : ''}`}>
            Orders
          </Link>
          <Link href="/admin/dashboard/customers" className={`${styles.navLink} ${pathname === '/admin/dashboard/customers' ? styles.active : ''}`}>
            Customers
          </Link>
          <Link href="/admin/dashboard/discounts" className={`${styles.navLink} ${pathname === '/admin/dashboard/discounts' ? styles.active : ''}`}>
            Discounts & Offers
          </Link>
          <Link href="/admin/dashboard/shipping" className={`${styles.navLink} ${pathname === '/admin/dashboard/shipping' ? styles.active : ''}`}>
            Shipping Zones
          </Link>
          <Link href="/admin/dashboard/support" className={`${styles.navLink} ${pathname === '/admin/dashboard/support' ? styles.active : ''}`}>
            AI & Support
          </Link>
        </nav>
        <div className={styles.logout}>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h3>Dashboard</h3>
          <div className={styles.profile}>Admin User</div>
        </header>
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
