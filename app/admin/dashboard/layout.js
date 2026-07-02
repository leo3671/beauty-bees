"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-block w-8 h-8 border-4 border-bb-pink border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="ml-3 text-slate-500 font-medium">Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 flex-shrink-0 justify-between">
        <div>
          <div className="mb-8">
            <h2 className="font-heading text-lg font-bold text-bb-heading">Beauty Bees</h2>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Admin Panel</span>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { href: '/admin/dashboard', label: 'Overview' },
              { href: '/admin/dashboard/inventory', label: 'Inventory & Pricing' },
              { href: '/admin/dashboard/users', label: 'User Management' },
              { href: '/admin/dashboard/brands', label: 'Brands & Logos' },
              { href: '/admin/dashboard/orders', label: 'Orders' },
              { href: '/admin/dashboard/customers', label: 'Customers' },
              { href: '/admin/dashboard/discounts', label: 'Discounts & Offers' },
              { href: '/admin/dashboard/shipping', label: 'Shipping Zones' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors no-underline",
                  pathname === link.href 
                    ? "bg-bb-pink text-white" 
                    : "text-bb-text/80 hover:bg-bb-peach/50 hover:text-bb-pink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-slate-100 pt-4 mt-6">
          <button 
            onClick={handleLogout} 
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl transition-colors border-none cursor-pointer text-sm"
          >
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
          <h3 className="font-heading text-lg font-bold text-bb-heading">Dashboard</h3>
          <div className="text-sm font-semibold text-bb-text">Admin User</div>
        </header>
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
