"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successful! Please sign in.');
        router.push('/login');
      } else {
        toast.error(data.error || 'Reset failed');
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
          <img src="/logo_fixed.png" alt="Beauty Bees Cosmetics" className="h-12 mx-auto object-contain" />
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl border border-bb-border/30 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1.5">Reset Password</h1>
            <p className="text-sm text-slate-500">Enter the code sent to {email} and choose a new password.</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-bb-text">6-Digit Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter Code"
                maxLength={6}
                required
                autoComplete="one-time-code"
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-bb-text">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                autoComplete="new-password"
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-bb-text">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                autoComplete="new-password"
                className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all placeholder:text-slate-400"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-bb-pink text-white hover:bg-bb-pink-hover h-12 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 border-none cursor-pointer mt-2" 
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
