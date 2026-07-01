"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (res.ok) {
        setError('You do not have permission to access the admin area.');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bb-bg px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-2xl border border-bb-border/30 shadow-sm text-center">
        <h2 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Beauty Bees Cosmetics Admin</h2>
        <p className="text-sm text-slate-500 mb-6">Log in to manage your store.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
          {error && (
            <div className="color-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-bb-text">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@beautybees.com" 
              required 
              className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-bb-text">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              required 
              className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all placeholder:text-slate-400"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-bb-heading hover:bg-bb-text text-white font-bold py-3.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors mt-2 disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
