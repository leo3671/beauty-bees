"use client";

import { useState, useEffect } from 'react';
import styles from './shipping.module.css';
import { toast } from 'react-hot-toast';

export default function ShippingManagement() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newZone, setNewZone] = useState({ name: '', fee: '' });
  const [editingZone, setEditingZone] = useState(null);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await fetch('/api/admin/shipping');
      const data = await res.json();
      if (Array.isArray(data)) setZones(data);
    } catch (e) {
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone)
      });
      if (res.ok) {
        toast.success('Zone created');
        setNewZone({ name: '', fee: '' });
        fetchZones();
      }
    } catch (e) {
      toast.error('Failed to create zone');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingZone)
      });
      if (res.ok) {
        toast.success('Zone updated');
        setEditingZone(null);
        fetchZones();
      }
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        toast.success('Zone deleted');
        fetchZones();
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Shipping Zones</h1>
        <p>Pre-set shipping fees based on delivery districts.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.formCard}>
          <h2>{editingZone ? 'Edit Zone' : 'Add New Zone'}</h2>
          <form onSubmit={editingZone ? handleUpdate : handleCreate}>
            <div className={styles.field}>
              <label>District/Location Name</label>
              <input 
                type="text" 
                placeholder="e.g. Kathmandu"
                value={editingZone ? editingZone.name : newZone.name}
                onChange={(e) => editingZone ? setEditingZone({...editingZone, name: e.target.value}) : setNewZone({...newZone, name: e.target.value})}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Shipping Fee (Rs.)</label>
              <input 
                type="number" 
                placeholder="e.g. 100"
                value={editingZone ? editingZone.fee : newZone.fee}
                onChange={(e) => editingZone ? setEditingZone({...editingZone, fee: e.target.value}) : setNewZone({...newZone, fee: e.target.value})}
                required
              />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                {editingZone ? 'Update Zone' : 'Create Zone'}
              </button>
              {editingZone && <button type="button" onClick={() => setEditingZone(null)} className={styles.cancelBtn}>Cancel</button>}
            </div>
          </form>
        </div>

        <div className={styles.listCard}>
          <h2>Active Zones</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Location</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(z => (
                <tr key={z.id}>
                  <td>{z.name}</td>
                  <td>Rs. {z.fee}</td>
                  <td>
                    <button onClick={() => setEditingZone(z)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(z.id)} className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
