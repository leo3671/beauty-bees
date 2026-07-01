"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

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

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchOrders();
      else alert("Failed to update status");
    } catch (e) {
      console.error(e);
      alert("Error updating status");
    }
  };

  const updatePaymentStatus = async (id, newPaymentStatus) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, paymentStatus: newPaymentStatus })
      });
      if (res.ok) fetchOrders();
      else alert("Failed to update payment status");
    } catch (e) {
      console.error(e);
      alert("Error updating payment status");
    }
  };
  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = searchQuery === '' || 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Location', 'Payment Method', 'Payment Status', 'Status', 'Total', 'Date'];
    const rows = filteredOrders.map(o => [
      o.id, o.customer, o.email, o.location || '', o.paymentMethod || '', o.paymentStatus || '', o.status, o.total, new Date(o.date).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-bb-heading">Order Management</h1>
        <button 
          onClick={exportCSV} 
          className="bg-bb-heading hover:bg-bb-text text-white text-sm font-bold px-4 py-2.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search by Order ID, Customer, or Email..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-[2] bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
        />
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select 
          value={paymentFilter} 
          onChange={e => setPaymentFilter(e.target.value)}
          className="bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
        >
          <option value="All">All Payments</option>
          <option value="Verified">Verified</option>
          <option value="Pending Verification">Pending Verification</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Showing {filteredOrders.length} of {orders.length} orders</p>
      
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-500 font-medium">Loading live orders...</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 font-medium">No orders have been placed yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fulfillment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-bb-heading">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-bb-heading">{order.customer}</div>
                      <a href={`mailto:${order.email}`} className="text-xs text-bb-pink hover:underline font-semibold">{order.email}</a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-bold text-slate-600 uppercase tracking-wider">
                        {order.paymentMethod || 'COD'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(order.date).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-bb-heading">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={cn(
                          "px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 outline-none cursor-pointer transition-colors",
                          order.status === 'Pending' && "bg-amber-50 text-amber-700",
                          order.status === 'Shipped' && "bg-blue-50 text-blue-700",
                          order.status === 'Cancelled' && "bg-red-50 text-red-700",
                          order.status === 'Delivered' && "bg-green-50 text-green-700"
                        )}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    {/* === PAYMENT VERIFICATION COLUMN === */}
                    <td className="px-6 py-4">
                      {(order.paymentMethod || 'Cash on Delivery') === 'Cash on Delivery' ? (
                        <span className="bg-green-50 text-green-700 px-2.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          COD Auto-Verified
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          <select 
                            value={order.paymentStatus || 'Pending Verification'} 
                            onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                            className={cn(
                              "px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 outline-none cursor-pointer transition-colors",
                              order.paymentStatus === 'Verified' && "bg-green-50 text-green-700",
                              order.paymentStatus === 'Failed' && "bg-red-50 text-red-700",
                              (order.paymentStatus !== 'Verified' && order.paymentStatus !== 'Failed') && "bg-amber-50 text-amber-700"
                            )}
                          >
                            <option value="Pending Verification">⏳ Pending</option>
                            <option value="Verified">✅ Verified</option>
                            <option value="Failed">❌ Failed</option>
                          </select>
                          {order.paymentScreenshot && (
                            <a 
                              href={order.paymentScreenshot} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-bb-pink font-bold hover:underline mt-1"
                            >
                              View Receipt
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        className="bg-bb-heading hover:bg-bb-text text-white text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
                      >
                        {expandedOrderId === order.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {/* Expandable Order Details Row */}
                  {expandedOrderId === order.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan="8" className="px-6 py-6 border-t border-slate-100">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Order Items */}
                          <div className="flex-[2]">
                            <h4 className="font-heading text-sm font-bold text-slate-700 mb-3">Items in this order:</h4>
                            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                              {order.items && order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4">
                                  <span className="text-sm font-semibold text-slate-700">
                                    <strong className="text-bb-pink mr-2">{item.quantity}x</strong> 
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-400">ID: {item.id}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping & Payment Details */}
                          <div className="flex-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                            <h4 className="font-heading text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">Shipping & Payment</h4>
                            <div className="text-xs leading-relaxed text-slate-600">
                              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Shipping Location</span>
                              {order.location || 'Not provided'}
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verify Payment:</label>
                              <select 
                                value={order.paymentStatus || 'Pending Verification'} 
                                onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-3 py-2 text-xs text-bb-text outline-none focus:border-bb-pink transition-all"
                              >
                                <option value="Pending Verification">Pending Verification</option>
                                <option value="Verified">Verified</option>
                                <option value="Failed">Failed</option>
                              </select>
                            </div>

                            {order.paymentScreenshot && (
                              <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Receipt Screenshot</span>
                                <a href={order.paymentScreenshot} target="_blank" rel="noreferrer" className="w-full h-40 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1">
                                  <img 
                                    src={order.paymentScreenshot} 
                                    alt="Payment Receipt" 
                                    className="w-full h-full object-contain" 
                                  />
                                </a>
                                <small className="text-[10px] text-center text-slate-400 block font-semibold">Click image to enlarge</small>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
