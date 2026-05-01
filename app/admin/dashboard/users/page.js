"use client";

import { useState, useEffect } from 'react';
import styles from './users.module.css';
import { toast } from 'react-hot-toast';

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

  if (loading) return <div style={{ padding: '40px' }}>Loading users...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>User Management</h1>
        <p>Total Registered Users: {users.length}</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`${styles.badge} ${user.role === 'admin' ? styles.adminBadge : styles.userBadge}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{user.isVerified ? '✅' : '❌'}</td>
                <td>
                  <button 
                    className={styles.editBtn} 
                    onClick={() => {
                      setEditingUser(user);
                      setEditData({ password: '', role: user.role });
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit User: {editingUser.name}</h2>
            <form onSubmit={handleUpdateUser}>
              <div className={styles.field}>
                <label>Change Role</label>
                <select 
                  value={editData.role} 
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Set New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password to override"
                  value={editData.password}
                  onChange={(e) => setEditData({...editData, password: e.target.value})}
                />
                <p className={styles.hint}>Leave blank to keep current password</p>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveBtn} disabled={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
