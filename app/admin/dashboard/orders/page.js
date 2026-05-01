"use client";

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className={styles.title} style={{ marginBottom: 0 }}>Order Management</h1>
        <button onClick={exportCSV} style={{ padding: '8px 16px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          📥 Export CSV
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by Order ID, Customer, or Email..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 2, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9em', minWidth: '250px' }}
        />
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9em' }}
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
          style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9em' }}
        >
          <option value="All">All Payments</option>
          <option value="Verified">Verified</option>
          <option value="Pending Verification">Pending Verification</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.85em', marginBottom: '15px' }}>Showing {filteredOrders.length} of {orders.length} orders</p>
      
      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: '20px' }}>Loading live orders...</p>
        ) : orders.length === 0 ? (
          <p style={{ padding: '20px' }}>No orders have been placed yet.</p>
        ) : (
          <table className={styles.table} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Total</th>
                <th>Fulfillment</th>
                <th>Payment Verification</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr style={{ borderBottom: expandedOrderId === order.id ? 'none' : '1px solid var(--border-light)' }}>
                    <td style={{ fontWeight: '500' }}>{order.id}</td>
                    <td>
                      {order.customer}<br />
                      <a href={`mailto:${order.email}`} style={{ color: '#2563eb', fontSize: '0.85em' }}>{order.email}</a>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.8em', 
                        fontWeight: '600',
                        backgroundColor: order.paymentMethod === 'Cash on Delivery' ? '#f1f5f9' : '#eff6ff',
                        color: order.paymentMethod === 'Cash on Delivery' ? '#475569' : '#2563eb'
                      }}>
                        {order.paymentMethod || 'COD'}
                      </span>
                    </td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td style={{ fontWeight: 'bold' }}>Rs. {order.total.toLocaleString()}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: '6px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          backgroundColor: order.status === 'Pending' ? '#fffbeb' : 
                                           order.status === 'Shipped' ? '#eff6ff' : 
                                           order.status === 'Cancelled' ? '#fee2e2' : '#f0fdf4',
                          color: order.status === 'Pending' ? '#d97706' : 
                                 order.status === 'Shipped' ? '#2563eb' : 
                                 order.status === 'Cancelled' ? '#ef4444' : '#16a34a',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    {/* === PAYMENT VERIFICATION COLUMN === */}
                    <td>
                      {(order.paymentMethod || 'Cash on Delivery') === 'Cash on Delivery' ? (
                        <span style={{
                          padding: '5px 12px',
                          borderRadius: '12px',
                          fontSize: '0.8em',
                          fontWeight: '600',
                          backgroundColor: '#f0fdf4',
                          color: '#16a34a'
                        }}>
                          ✅ Auto-Verified (COD)
                        </span>
                      ) : (
                        <>
                          <select 
                            value={order.paymentStatus || 'Pending Verification'} 
                            onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              backgroundColor: order.paymentStatus === 'Verified' ? '#f0fdf4' : 
                                               order.paymentStatus === 'Failed' ? '#fee2e2' : '#fffbeb',
                              color: order.paymentStatus === 'Verified' ? '#16a34a' : 
                                     order.paymentStatus === 'Failed' ? '#ef4444' : '#d97706',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
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
                              style={{ display: 'block', fontSize: '0.75em', color: '#2563eb', marginTop: '4px', textDecoration: 'underline' }}
                            >
                              📎 View Receipt
                            </a>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        style={{ 
                          padding: '6px 12px', 
                          background: 'var(--text-dark)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer' 
                        }}
                      >
                        {expandedOrderId === order.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {/* Expandable Order Details Row */}
                  {expandedOrderId === order.id && (
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                      <td colSpan="8" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '40px' }}>
                          {/* Order Items */}
                          <div style={{ flex: 2 }}>
                            <h4 style={{ marginBottom: '10px', color: '#334155' }}>Items in this order:</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {order.items && order.items.map((item, idx) => (
                                <li key={idx} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  padding: '10px 0',
                                  borderBottom: idx === order.items.length - 1 ? 'none' : '1px dashed #cbd5e1'
                                }}>
                                  <span>
                                    <strong style={{ marginRight: '10px' }}>{item.quantity}x</strong> 
                                    {item.name}
                                  </span>
                                  <span style={{ color: '#64748b' }}>Item ID: {item.id}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Shipping & Payment Details */}
                          <div style={{ flex: 1, backgroundColor: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ marginBottom: '10px', color: '#334155' }}>Shipping & Payment</h4>
                            <p style={{ margin: '0 0 15px 0', fontSize: '0.9em' }}>
                              <strong>Location:</strong><br />
                              {order.location || 'Not provided'}
                            </p>
                            
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', fontSize: '0.9em', fontWeight: 'bold', marginBottom: '5px' }}>Verify Payment Status:</label>
                              <select 
                                value={order.paymentStatus || 'Pending Verification'} 
                                onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                                style={{ padding: '6px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                              >
                                <option value="Pending Verification">Pending Verification</option>
                                <option value="Verified">Verified</option>
                                <option value="Failed">Failed</option>
                              </select>
                            </div>

                            {order.paymentScreenshot && (
                              <div>
                                <p style={{ fontSize: '0.9em', fontWeight: 'bold', marginBottom: '5px' }}>Payment Screenshot:</p>
                                <a href={order.paymentScreenshot} target="_blank" rel="noreferrer">
                                  <img 
                                    src={order.paymentScreenshot} 
                                    alt="Payment Receipt" 
                                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px' }} 
                                  />
                                </a>
                                <small style={{ display: 'block', textAlign: 'center', marginTop: '4px', color: '#64748b' }}>Click image to enlarge</small>
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
