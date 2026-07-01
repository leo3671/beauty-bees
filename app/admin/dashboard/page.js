"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProducts } from '../../../lib/ProductContext';
import { cn } from '@/lib/utils';

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
  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, o) => sum + o.total, 0) : 0;
  const pendingOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'Pending') : [];
  const deliveredOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'Delivered') : [];
  const cancelledOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'Cancelled') : [];
  const verifiedPayments = Array.isArray(orders) ? orders.filter(o => o.paymentStatus === 'Verified') : [];
  const pendingPayments = Array.isArray(orders) ? orders.filter(o => o.paymentStatus !== 'Verified') : [];
  const uniqueCustomers = Array.isArray(orders) ? [...new Set(orders.map(o => o.email))] : [];
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

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-bb-heading mb-6">Dashboard Overview</h1>
      
      {/* === KPI Stats Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link 
          href="/admin/dashboard/orders" 
          className="bg-gradient-to-br from-bb-pink to-bb-pink-hover text-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300 no-underline"
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-90">Total Revenue</div>
          <div className="text-2xl font-bold my-2">Rs. {totalRevenue.toLocaleString()}</div>
          <div className="text-xs opacity-80">{orders.length} orders total</div>
        </Link>
        <Link 
          href="/admin/dashboard/customers" 
          className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300 no-underline"
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-90">Avg Order Value</div>
          <div className="text-2xl font-bold my-2">Rs. {avgOrderValue.toLocaleString()}</div>
          <div className="text-xs opacity-80">{uniqueCustomers.length} unique customers</div>
        </Link>
        <Link 
          href="/admin/dashboard/orders" 
          className="bg-gradient-to-br from-purple-600 to-purple-500 text-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300 no-underline"
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-90">Payments Verified</div>
          <div className="text-2xl font-bold my-2">{verifiedPayments.length}</div>
          <div className="text-xs opacity-80">{pendingPayments.length} pending verification</div>
        </Link>
        <Link 
          href="/admin/dashboard/inventory" 
          className="bg-gradient-to-br from-red-500 to-red-400 text-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300 no-underline"
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-90">Needs Attention</div>
          <div className="text-2xl font-bold my-2">{pendingOrders.length + outOfStockProducts.length}</div>
          <div className="text-xs opacity-80">{pendingOrders.length} pending, {outOfStockProducts.length} out of stock</div>
        </Link>
      </div>

      {/* === Status Breakdown + Revenue Chart Row === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-heading font-bold text-slate-700 text-base">Order Status</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Pending', count: pendingOrders.length, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50/50' },
              { label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50/50' },
              { label: 'Delivered', count: deliveredOrders.length, color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50/50' },
              { label: 'Cancelled', count: cancelledOrders.length, color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50/50' },
            ].map(s => (
              <div key={s.label} className={cn("flex justify-between items-center p-3 rounded-xl", s.bg)}>
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-2.5 h-2.5 rounded-full", s.color)}></div>
                  <span className="text-sm font-semibold text-slate-600">{s.label}</span>
                </div>
                <span className={cn("text-sm font-bold", s.text)}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Bar Chart (Last 7 Days) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-bold text-slate-700 text-base mb-4">Revenue (Last 7 Days)</h3>
          <div className="flex items-end gap-3 h-[180px] pt-4">
            {revenueByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                <div className="text-[9px] font-bold text-slate-500 mb-1">
                  {d.revenue > 0 ? `Rs.${d.revenue.toLocaleString()}` : ''}
                </div>
                <div 
                  className={cn(
                    "w-full rounded-t-lg min-h-[4px] transition-all duration-500",
                    d.revenue > 0 ? "bg-gradient-to-t from-bb-pink to-bb-pink-hover" : "bg-slate-100"
                  )}
                  style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%` }}
                ></div>
                <div className="text-[10px] font-semibold text-slate-400 mt-2">{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Bottom Row: Top Products + Quick Alerts === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-bold text-slate-700 text-base mb-4">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-slate-400 text-sm">No sales data yet.</p>
          ) : (
            <div className="flex flex-col">
              {topProducts.map(([name, data], idx) => (
                <div key={name} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="bg-slate-100 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px] md:max-w-[280px]">{name}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-xs text-bb-heading">{data.quantity} sold</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <h3 className="font-heading font-bold text-slate-700 text-base mb-2">Quick Alerts</h3>
          
          {pendingPayments.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <div className="text-xs text-amber-800 font-medium">
                <strong className="text-amber-900 font-bold">{pendingPayments.length} payment(s)</strong> awaiting verification
              </div>
            </div>
          )}

          {outOfStockProducts.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <span className="text-lg">🚨</span>
              <div className="text-xs text-red-800 font-medium">
                <strong className="text-red-900 font-bold">{outOfStockProducts.length} product(s)</strong> marked out of stock
              </div>
            </div>
          )}

          {activeDiscounts.length > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <span className="text-lg">🏷️</span>
              <div className="text-xs text-green-800 font-medium">
                <strong className="text-green-900 font-bold">{activeDiscounts.length} active discount(s)</strong> running on storefront
              </div>
            </div>
          )}

          {pendingOrders.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
              <span className="text-lg">📦</span>
              <div className="text-xs text-blue-800 font-medium">
                <strong className="text-blue-900 font-bold">{pendingOrders.length} order(s)</strong> need to be shipped
              </div>
            </div>
          )}

          {pendingPayments.length === 0 && outOfStockProducts.length === 0 && pendingOrders.length === 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <span className="text-lg">✅</span>
              <div className="text-xs text-green-800 font-medium">
                <strong className="text-green-900 font-bold">All clear!</strong> No pending actions.
              </div>
            </div>
          )}
      </div>
    </div>
  </div>
  );
}
