"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
      <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Customer Management</h1>
      <p className="text-sm text-slate-500 mb-6">
        View all registered customers and their complete purchase history.
      </p>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center">
          <div className="text-3xl font-bold text-bb-heading mb-1">{customers.length}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center">
          <div className="text-3xl font-bold text-bb-heading mb-1">Rs. {customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lifetime Revenue</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center">
          <div className="text-3xl font-bold text-bb-heading mb-1">Rs. {customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length).toLocaleString() : 0}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Customer Value</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-500 font-medium">Loading customers...</p>
        ) : customers.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 font-medium">No customers found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Total Orders</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(customer => (
                <React.Fragment key={customer.email}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-bb-heading">{customer.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <a href={`mailto:${customer.email}`} className="text-bb-pink hover:underline font-medium">{customer.email}</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">{customer.orders.length}</td>
                    <td className="px-6 py-4 text-sm font-bold text-bb-heading">Rs. {customer.totalSpent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(customer.lastOrder).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => setExpandedEmail(expandedEmail === customer.email ? null : customer.email)}
                        className="bg-bb-heading hover:bg-bb-text text-white text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm"
                      >
                        {expandedEmail === customer.email ? 'Hide History' : 'View History'}
                      </button>
                    </td>
                  </tr>
                  {expandedEmail === customer.email && (
                    <tr className="bg-slate-50/50">
                      <td colSpan="6" className="px-6 py-6 border-t border-slate-100">
                        <h4 className="font-heading text-sm font-bold text-slate-700 mb-4">Purchase History for {customer.name}</h4>
                        <div className="flex flex-col gap-3">
                          {customer.orders.map(order => (
                            <div key={order.id} className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div className="text-xs font-semibold text-bb-heading">
                                  <strong>Order #{order.id}</strong>
                                  <span className="text-slate-400 ml-3">{new Date(order.date).toLocaleString()}</span>
                                </div>
                                <div className="flex gap-3 items-center">
                                  <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                    order.status === 'Delivered' && "bg-green-50 text-green-700",
                                    order.status === 'Cancelled' && "bg-red-50 text-red-700",
                                    order.status === 'Shipped' && "bg-blue-50 text-blue-700",
                                    order.status === 'Pending' && "bg-amber-50 text-amber-700"
                                  )}>
                                    {order.status}
                                  </span>
                                  <span className="font-bold text-sm text-bb-heading">Rs. {order.total.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="text-xs text-slate-500 leading-relaxed">
                                {order.items && order.items.map((item, idx) => (
                                  <span key={idx}>
                                    {item.quantity}x {item.name}{idx < order.items.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[10px] font-semibold text-slate-400 mt-2 border-t border-slate-100 pt-2">
                                Payment: {order.paymentMethod || 'COD'} • Status: {order.paymentStatus || 'Pending'}
                              </div>
                            </div>
                          ))}
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
