"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Reusable styled input
function AuthInput({ icon: Icon, type, value, onChange, placeholder, required, children }) {
  return (
    <div className="relative flex items-center">
      {Icon && <Icon size={18} className="absolute left-4 text-slate-400 pointer-events-none z-10" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-bb-bg border border-bb-border/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-bb-text
          outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all
          placeholder:text-slate-400"
      />
      {children}
    </div>
  );
}

export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [otp, setOtp]               = useState('');
  const [authState, setAuthState]   = useState('LOGIN');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: authState === 'VERIFY' ? 'EMAIL_VERIFICATION' : 'MFA' })
      });
      if (res.ok) {
        toast.success('Verification code resent');
        setResendTimer(60);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.requiresMFA) {
          setAuthState('MFA');
          toast.success('MFA code sent to your email');
          setResendTimer(60);
          if (data.devOTP) toast.success(`[DEV] Code: ${data.devOTP}`, { duration: 10000 });
        } else {
          toast.success('Welcome back!');
          router.push(data.role === 'admin' ? '/admin/dashboard' : '/account');
        }
      } else {
        if (data.requiresVerification) {
          setAuthState('VERIFY');
          toast.error('Account not verified. Code sent.');
          setResendTimer(60);
          if (data.devOTP) toast.success(`[DEV] Code: ${data.devOTP}`, { duration: 10000 });
        } else {
          setError(data.error || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp, type: authState === 'VERIFY' ? 'EMAIL_VERIFICATION' : 'MFA' })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(authState === 'VERIFY' ? 'Email verified!' : 'Identity confirmed!');
        router.push(data.role === 'admin' ? '/admin/dashboard' : '/account');
      } else {
        setError(data.error || 'The code you entered is incorrect.');
      }
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Side (desktop only) */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 relative overflow-hidden">
        <img
          src="/images/premium-bg.png"
          alt="Premium K-Beauty"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bb-heading/70 to-bb-pink/30 flex flex-col items-center justify-center text-center px-12">
          <div className="text-white">
            <h2 className="font-heading text-4xl font-bold leading-tight mb-4">
              Unveil Your<br />Natural Radiance
            </h2>
            <p className="text-white/80 text-[1rem] leading-relaxed max-w-[360px] mx-auto">
              Experience the finest selection of authentic Korean skincare, curated specifically for your skin&apos;s unique needs.
            </p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-bb-bg">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/">
              <img src="/logo_fixed.png" alt="Beauty Bees Cosmetics" className="h-12 mx-auto object-contain" />
            </Link>
          </div>

          <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1 text-center">
            {authState === 'LOGIN' ? 'Sign In' : authState === 'VERIFY' ? 'Confirm Identity' : 'Secure Login'}
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            {authState === 'LOGIN'
              ? 'Welcome back to Beauty Bees Cosmetics.'
              : `A verification code has been sent to ${email}`}
          </p>

          {/* Error Box */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <ShieldCheck size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authState === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-bb-text">Email Address</label>
                <AuthInput icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-bb-text">Password</label>
                  <Link href="/forgot-password" className="text-xs text-bb-pink hover:underline">Forgot password?</Link>
                </div>
                <AuthInput icon={Lock} type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required>
                  <button
                    type="button"
                    className="absolute right-4 text-slate-400 hover:text-bb-text bg-transparent border-none cursor-pointer flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </AuthInput>
              </div>

              <label className="flex items-center gap-2 text-sm text-bb-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="accent-bb-pink w-4 h-4"
                />
                Keep me signed in for 30 days
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-bb-pink text-white hover:bg-bb-pink-hover h-12 rounded-xl text-sm font-semibold mt-1 gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span> <ArrowRight size={18} /></>}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-bb-text">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="w-full text-center text-2xl tracking-[6px] font-bold border border-bb-border/60 bg-bb-bg rounded-xl py-4
                    outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-bb-pink text-white hover:bg-bb-pink-hover h-12 rounded-xl text-sm font-semibold"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Continue'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  className={cn(
                    "text-sm text-bb-pink hover:underline bg-transparent border-none cursor-pointer",
                    (resendTimer > 0 || loading) && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
                </button>
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-2 text-sm text-bb-text bg-transparent border-none cursor-pointer hover:text-bb-pink transition-colors"
                onClick={() => setAuthState('LOGIN')}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </form>
          )}

          {authState === 'LOGIN' && (
            <>
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-bb-border/40" />
                </div>
                <span className="relative bg-bb-bg px-3 text-xs text-slate-400">or</span>
              </div>
              <button
                className="w-full border border-bb-border/60 bg-white text-bb-text py-3 rounded-xl text-sm font-medium
                  hover:border-bb-pink hover:text-bb-pink transition-colors cursor-pointer"
                onClick={() => router.push('/shop')}
              >
                Browse as Guest
              </button>
              <p className="text-center text-sm text-slate-500 mt-4">
                New to Beauty Bees?{' '}
                <Link href="/register" className="text-bb-pink font-semibold hover:underline">Create an account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
