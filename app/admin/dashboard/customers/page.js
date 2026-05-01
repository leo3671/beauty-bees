"use client";

import React, { useState, useEffect } from 'react';
import styles from '../page.module.css';

export default function CustomerManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEmail, setExpandedEmail] = useState(null);

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

  // Group orders by customer email
  const customerMap = {};
  orders.forEach(order => {
    if (!customerMap[order.email]) {
      customerMap[order.email] = {
        email: order.email,
        name: order.customer,
        orders: [],
        totalSpent: 0,
        firstOrder: order.date,
        lastOrder: order.date
      };
    }
    customerMap[order.email].orders.push(order);
    customerMap[order.email].totalSpent += order.total;
    if (new Date(order.date) < new Date(customerMap[order.email].firstOrder)) {
      customerMap[order.email].firstOrder = order.date;
    }
    if (new Date(order.date) > new Date(customerMap[order.email].lastOrder)) {
      customerMap[order.email].lastOrder = order.date;
    }
  });

  const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div>
      <h1 className={styles.title}>Customer Management</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        View all registered customers and their complete purchase history.
      </p>

      {/* Customer Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1e293b' }}>{customers.length}</div>
          <div style={{ fontSize: '0.85em', color: '#64748b' }}>Total Customers</div>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1e293b' }}>Rs. {customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.85em', color: '#64748b' }}>Lifetime Revenue</div>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1e293b' }}>{customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length) : 0}</div>
          <div style={{ fontSize: '0.85em', color: '#64748b' }}>Avg. Customer Value (Rs.)</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: '20px' }}>Loading customers...</p>
        ) : customers.length === 0 ? (
          <p style={{ padding: '20px' }}>No customers found.</p>
        ) : (
          <table className={styles.table} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <React.Fragment key={customer.email}>
                  <tr style={{ borderBottom: expandedEmail === customer.email ? 'none' : '1px solid var(--border-light)' }}>
                    <td style={{ fontWeight: '500' }}>{customer.name}</td>
                    <td>
                      <a href={`mailto:${customer.email}`} style={{ color: '#2563eb', fontSize: '0.9em' }}>{customer.email}</a>
                    </td>
                    <td style={{ textAlign: 'center' }}>{customer.orders.length}</td>
                    <td style={{ fontWeight: 'bold' }}>Rs. {customer.totalSpent.toLocaleString()}</td>
                    <td>{new Date(customer.lastOrder).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => setExpandedEmail(expandedEmail === customer.email ? null : customer.email)}
                        style={{ 
                          padding: '6px 12px', 
                          background: 'var(--text-dark)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer' 
                        }}
                      >
                        {expandedEmail === customer.email ? 'Hide History' : 'View History'}
                      </button>
                    </td>
                  </tr>
                  {expandedEmail === customer.email && (
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-light)' }}>
                      <td colSpan="6" style={{ padding: '20px' }}>
                        <h4 style={{ marginBottom: '15px', color: '#334155' }}>Purchase History for {customer.name}</h4>
                        {customer.orders.map(order => (
                          <div key={order.id} style={{ 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            marginBottom: '10px',
                            backgroundColor: 'white'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <div>
                                <strong>{order.id}</strong>
                                <span style={{ color: '#64748b', marginLeft: '15px' }}>{new Date(order.date).toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ 
                                  padding: '4px 8px', 
                                  borderRadius: '12px', 
                                  fontSize: '0.8em', 
                                  fontWeight: '600',
                                  backgroundColor: order.status === 'Delivered' ? '#dcfce7' : 
                                                   order.status === 'Cancelled' ? '#fee2e2' : 
                                                   order.status === 'Shipped' ? '#dbeafe' : '#fef3c7',
                                  color: order.status === 'Delivered' ? '#16a34a' : 
                                         order.status === 'Cancelled' ? '#ef4444' : 
                                         order.status === 'Shipped' ? '#2563eb' : '#d97706'
                                }}>
                                  {order.status}
                                </span>
                                <span style={{ fontWeight: 'bold' }}>Rs. {order.total.toLocaleString()}</span>
                              </div>
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#475569' }}>
                              {order.items && order.items.map((item, idx) => (
                                <span key={idx}>
                                  {item.quantity}x {item.name}{idx < order.items.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                            <div style={{ fontSize: '0.8em', color: '#94a3b8', marginTop: '8px' }}>
                              Payment: {order.paymentMethod || 'COD'} • Status: {order.paymentStatus || 'Pending'}
                            </div>
                          </div>
                        ))}
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
