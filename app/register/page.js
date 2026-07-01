"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Inline icon SVGs for field labels
const icons = {
  user:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  lock:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  shield:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

function FieldInput({ icon, type, id, value, onChange, placeholder, required, autoComplete, children }) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-4 text-slate-400 pointer-events-none z-10 flex items-center">{icon}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-bb-bg border border-bb-border/60 rounded-xl pl-11 pr-4 py-3.5 text-sm text-bb-text
          outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all
          placeholder:text-slate-400"
      />
      {children}
    </div>
  );
}

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(pw)) score++;
  if (score <= 2) return { score, label: 'Weak',   color: '#ef4444' };
  if (score <= 3) return { score, label: 'Fair',   color: '#f59e0b' };
  if (score <= 4) return { score, label: 'Good',   color: '#3b82f6' };
  return                { score, label: 'Strong',  color: '#16a34a' };
};

export default function Register() {
  const [name, setName]                     = useState('');
  const [email, setEmail]                   = useState('');
  const [phone, setPhone]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [showPassword, setShowPassword]     = useState(false);
  const [authState, setAuthState]           = useState('REGISTER');
  const [otp, setOtp]                       = useState('');
  const [resendTimer, setResendTimer]       = useState(0);
  const router = useRouter();
  const strength = getPasswordStrength(password);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'EMAIL_VERIFICATION' })
      });
      if (res.ok) { toast.success('New code sent to your email'); startResendTimer(); }
    } catch { setError('Failed to resend code'); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp, type: 'EMAIL_VERIFICATION' })
      });
      const data = await res.json();
      if (res.ok) { toast.success('Email verified!'); router.push('/account'); }
      else { setError(data.error || 'Invalid code'); }
    } catch { setError('Verification failed'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (strength.score < 4)  { setError('Password must contain uppercase, lowercase, number, and special character.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.requiresVerification) {
          setAuthState('VERIFY');
          startResendTimer();
          if (data.devOTP) toast.success(`DEV MODE: Your code is ${data.devOTP}`, { duration: 10000 });
          else toast.success('Account created! Please enter verification code.');
        } else {
          router.push('/account');
        }
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image side */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 relative overflow-hidden">
        <img src="/images/kbeauty_products.png" alt="Popular K-Beauty Products" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-bb-heading/70 to-bb-pink/30 flex flex-col items-center justify-center text-center px-12">
          <div className="text-white">
            <div className="text-5xl mb-4">🐝</div>
            <h2 className="font-heading text-4xl font-bold leading-tight mb-4">
              Join the<br />Beauty Bees Cosmetics Family
            </h2>
            <p className="text-white/80 text-[1rem] leading-relaxed max-w-[380px] mx-auto">
              Create your account for a personalized skincare experience, order tracking, and exclusive member deals.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-bb-bg overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <span className="text-2xl">🐝</span>
            <span className="ml-2 font-heading font-bold text-bb-heading text-lg">Beauty Bees Cosmetics</span>
          </div>

          <h1 className="font-heading text-2xl font-bold text-bb-heading mb-1 text-center">
            {authState === 'REGISTER' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            {authState === 'REGISTER' ? 'Start your K-Beauty journey today.' : `We've sent a 6-digit code to your email.`}
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {authState === 'REGISTER' ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-bb-text">Full Name</label>
                <FieldInput icon={icons.user} id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" required autoComplete="name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-email" className="text-sm font-medium text-bb-text">Email</label>
                <FieldInput icon={icons.mail} id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-bb-text">Phone Number</label>
                <FieldInput icon={icons.phone} id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98XXXXXXXX" required autoComplete="tel" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-sm font-medium text-bb-text">Password</label>
                <FieldInput icon={icons.lock} id="reg-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 chars, uppercase, number, symbol" required autoComplete="new-password">
                  <button type="button" className="absolute right-4 text-slate-400 hover:text-bb-text bg-transparent border-none cursor-pointer flex items-center" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </FieldInput>
                {/* Password strength meter */}
                {password && (
                  <div className="mt-1">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ backgroundColor: i <= strength.score ? strength.color : '#e8dfe0' }} />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[0.75em] font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                      <span className="text-[0.7em] text-slate-400">
                        {password.length < 8 && '8+ chars '}
                        {!/[A-Z]/.test(password) && '• A-Z '}
                        {!/[0-9]/.test(password) && '• 0-9 '}
                        {!/[!@#$%^&*]/.test(password) && '• !@#'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className="text-sm font-medium text-bb-text">Confirm Password</label>
                <FieldInput icon={icons.shield} id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required autoComplete="new-password" />
                {confirmPassword && (
                  <span className={cn("text-[0.75em] mt-0.5", password === confirmPassword ? "text-green-600" : "text-red-500")}>
                    {password === confirmPassword ? '✓ Passwords match' : 'Passwords do not match'}
                  </span>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-bb-pink text-white hover:bg-bb-pink-hover h-12 rounded-xl text-sm font-semibold mt-1">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
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
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  className="w-full text-center text-2xl tracking-[6px] font-bold border border-bb-border/60 bg-bb-bg rounded-xl py-4
                    outline-none focus:border-bb-pink focus:shadow-[0_0_0_3px_rgba(255,183,197,0.2)] transition-all"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-bb-pink text-white hover:bg-bb-pink-hover h-12 rounded-xl text-sm font-semibold">
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <div className="text-center">
                <button type="button" className={cn("text-sm text-bb-pink hover:underline bg-transparent border-none cursor-pointer", (resendTimer > 0 || loading) && "opacity-50 cursor-not-allowed")} onClick={handleResend} disabled={resendTimer > 0 || loading}>
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
              <button type="button" className="text-sm text-bb-text hover:text-bb-pink bg-transparent border-none cursor-pointer text-center" onClick={() => setAuthState('REGISTER')}>
                Back to Registration
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-bb-pink font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
