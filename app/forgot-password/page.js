"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.devOTP) {
          toast.success(`DEV MODE: Code is ${data.devOTP}`, { duration: 10000 });
        }
        toast.success('Code sent! Redirecting to reset page...');
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bb-bg px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/">
            <img src="/logo_fixed.png" alt="Beauty Bees Cosmetics" className="h-12 mx-auto object-contain" />
          </Link>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl border border-bb-border/30 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Forgot Password?</h1>
            <p className="text-sm text-slate-500">Enter your email address to receive a reset code.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-bb-text">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3.5 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all placeholder:text-slate-400"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-bb-pink text-white hover:bg-bb-pink-hover h-12 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 border-none cursor-pointer" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Remembered your password? <Link href="/login" className="text-bb-pink font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
