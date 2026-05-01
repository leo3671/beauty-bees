"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useProducts } from '../../../lib/ProductContext';

export default function DashboardOverview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // === Analytics Calculations ===
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
  const verifiedPayments = orders.filter(o => o.paymentStatus === 'Verified');
  const pendingPayments = orders.filter(o => o.paymentStatus !== 'Verified');
  const uniqueCustomers = [...new Set(orders.map(o => o.email))];
  const outOfStockProducts = Array.isArray(products) ? products.filter(p => p.inStock === false) : [];
  const activeDiscounts = Array.isArray(products) ? products.filter(p => p.originalPrice && p.originalPrice > p.price) : [];
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Revenue by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const revenueByDay = last7Days.map(day => {
    const dayOrders = orders.filter(o => o.date && o.date.split('T')[0] === day);
    return { day: day.split('-').slice(1).join('/'), revenue: dayOrders.reduce((s, o) => s + o.total, 0) };
  });
  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1);

  // Top selling products
  const productSales = {};
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      if (!productSales[item.name]) productSales[item.name] = { quantity: 0, revenue: 0 };
      productSales[item.name].quantity += item.quantity;
      productSales[item.name].revenue += (item.price || 0) * item.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5);

  if (loading) return <div style={{ padding: '40px' }}>Loading dashboard...</div>;

  return (
    <div>
      <h1 className={styles.title}>Dashboard Overview</h1>
      
      {/* === KPI Stats Grid === */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <Link href="/admin/dashboard/orders" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #3f6212, #65a30d)', color: 'white', padding: '20px', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '0.85em', opacity: 0.9 }}>Total Revenue</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', margin: '8px 0' }}>Rs. {totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{orders.length} orders total</div>
        </Link>
        <Link href="/admin/dashboard/customers" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', padding: '20px', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '0.85em', opacity: 0.9 }}>Avg Order Value</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', margin: '8px 0' }}>Rs. {avgOrderValue.toLocaleString()}</div>
          <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{uniqueCustomers.length} unique customers</div>
        </Link>
        <Link href="/admin/dashboard/orders" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #9333ea, #a855f7)', color: 'white', padding: '20px', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '0.85em', opacity: 0.9 }}>Payments Verified</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', margin: '8px 0' }}>{verifiedPayments.length}</div>
          <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{pendingPayments.length} pending verification</div>
        </Link>
        <Link href="/admin/dashboard/inventory" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #dc2626, #f87171)', color: 'white', padding: '20px', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '0.85em', opacity: 0.9 }}>Needs Attention</div>
          <div style={{ fontSize: '1.8em', fontWeight: 'bold', margin: '8px 0' }}>{pendingOrders.length + outOfStockProducts.length}</div>
          <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{pendingOrders.length} pending, {outOfStockProducts.length} out of stock</div>
        </Link>
      </div>

      {/* === Status Breakdown + Revenue Chart Row === */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
        {/* Order Status Breakdown */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#334155' }}>Order Status</h3>
          {[
            { label: 'Pending', count: pendingOrders.length, color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Delivered', count: deliveredOrders.length, color: '#22c55e', bg: '#f0fdf4' },
            { label: 'Cancelled', count: cancelledOrders.length, color: '#ef4444', bg: '#fef2f2' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginBottom: '8px', backgroundColor: s.bg, borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }}></div>
                <span style={{ fontWeight: '500' }}>{s.label}</span>
              </div>
              <span style={{ fontWeight: 'bold', color: s.color }}>{s.count}</span>
            </div>
          ))}
        </div>

        {/* Revenue Bar Chart (Last 7 Days) */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#334155' }}>Revenue (Last 7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '10px 0' }}>
            {revenueByDay.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.7em', color: '#64748b', marginBottom: '4px' }}>
                  {d.revenue > 0 ? `Rs.${d.revenue}` : ''}
                </div>
                <div style={{
                  width: '100%',
                  height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%`,
                  background: d.revenue > 0 ? 'linear-gradient(180deg, #3f6212, #65a30d)' : '#f1f5f9',
                  borderRadius: '6px 6px 0 0',
                  minHeight: '4px',
                  transition: 'height 0.3s ease'
                }}></div>
                <div style={{ fontSize: '0.75em', color: '#94a3b8', marginTop: '6px' }}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Bottom Row: Top Products + Quick Alerts === */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Top Selling Products */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#334155' }}>Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No sales data yet.</p>
          ) : (
            <div>
              {topProducts.map(([name, data], idx) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < topProducts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8em', fontWeight: 'bold', color: '#64748b' }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.9em', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{data.quantity} sold</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Alerts */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#334155' }}>Quick Alerts</h3>
          
          {pendingPayments.length > 0 && (
            <div style={{ padding: '12px', marginBottom: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2em' }}>⚠️</span>
              <div>
                <strong style={{ color: '#d97706' }}>{pendingPayments.length} payment(s)</strong> awaiting verification
              </div>
            </div>
          )}

          {outOfStockProducts.length > 0 && (
            <div style={{ padding: '12px', marginBottom: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2em' }}>🚨</span>
              <div>
                <strong style={{ color: '#ef4444' }}>{outOfStockProducts.length} product(s)</strong> marked out of stock
              </div>
            </div>
          )}

          {activeDiscounts.length > 0 && (
            <div style={{ padding: '12px', marginBottom: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2em' }}>🏷️</span>
              <div>
                <strong style={{ color: '#16a34a' }}>{activeDiscounts.length} active discount(s)</strong> running on storefront
              </div>
            </div>
          )}

          {pendingOrders.length > 0 && (
            <div style={{ padding: '12px', marginBottom: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2em' }}>📦</span>
              <div>
                <strong style={{ color: '#2563eb' }}>{pendingOrders.length} order(s)</strong> need to be shipped
              </div>
            </div>
          )}

          {pendingPayments.length === 0 && outOfStockProducts.length === 0 && pendingOrders.length === 0 && (
            <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2em' }}>✅</span>
              <div>
                <strong style={{ color: '#16a34a' }}>All clear!</strong> No pending actions.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
