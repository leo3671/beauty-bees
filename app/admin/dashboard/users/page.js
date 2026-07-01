"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ password: '', role: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editingUser.id, ...editData })
      });
      if (res.ok) {
        toast.success('User updated successfully');
        setEditingUser(null);
        setEditData({ password: '', role: '' });
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Update failed');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto py-4">
      <header className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">User Management</h1>
        <p className="text-sm text-slate-500 font-medium">Total Registered Users: {users.length}</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-bb-heading">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                      user.role === 'superadmin' && "bg-purple-100 text-purple-700",
                      user.role === 'admin' && "bg-bb-peach text-bb-pink",
                      user.role !== 'admin' && user.role !== 'superadmin' && "bg-slate-100 text-slate-600"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">{user.isVerified ? '✅' : '❌'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button 
                      onClick={() => {
                        setEditingUser(user);
                        setEditData({ password: '', role: user.role });
                      }}
                      className="text-bb-heading hover:underline text-sm font-semibold bg-transparent border-none cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full border border-slate-100 shadow-xl flex flex-col gap-5">
            <h2 className="font-heading text-lg font-bold text-bb-heading">Edit User: {editingUser.name}</h2>
            <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Change Role</label>
                <select 
                  value={editData.role} 
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-bb-text">Set New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password to override"
                  value={editData.password}
                  onChange={(e) => setEditData({...editData, password: e.target.value})}
                  className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
                />
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Leave blank to keep current password</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-bb-text font-semibold py-2.5 rounded-xl transition-colors text-sm border-none cursor-pointer" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit" className="flex-1 bg-bb-pink hover:bg-bb-pink-hover text-white font-bold py-2.5 rounded-xl shadow-md transition-colors text-sm border-none cursor-pointer" disabled={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
