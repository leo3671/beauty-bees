"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'react-hot-toast';

export default function NotifyMeForm({ productId }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/products/notify-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, email })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success(data.message || 'We will notify you when this item is back in stock!');
      } else {
        toast.error(data.error || 'Failed to submit alert');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-semibold flex items-center gap-2">
        <span>🔔</span> We will notify you when this item is back in stock!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 p-4 bg-bb-peach/30 border border-bb-border/20 rounded-xl">
      <p className="text-xs font-semibold text-bb-heading">This item is currently out of stock. Want to be notified when it returns?</p>
      <div className="flex gap-2 max-sm:flex-col">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-2.5 text-sm bg-white border border-bb-border/50 rounded-xl outline-none focus:border-bb-pink transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-bb-heading hover:bg-bb-text text-white text-xs font-bold px-5 py-2.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors whitespace-nowrap disabled:opacity-75"
        >
          {loading ? 'Submitting...' : 'Notify Me'}
        </button>
      </div>
    </form>
  );
}
