"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authState, setAuthState] = useState('LOGIN'); // LOGIN, VERIFY, MFA
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
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
        body: JSON.stringify({ 
          email, 
          token: otp, 
          type: authState === 'VERIFY' ? 'EMAIL_VERIFICATION' : 'MFA' 
        })
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
    <div className={styles.authPage}>
      {/* Premium Hero Image Section */}
      <div className={styles.imageSide}>
        <img 
          src="/images/premium-bg.png" 
          alt="Premium K-Beauty" 
          className={styles.heroImage} 
        />
        <div className={styles.imageOverlay}>
          <div className={styles.imageContent}>
            <h2>Unveil Your<br/>Natural Radiance</h2>
            <p>Experience the finest selection of authentic Korean skincare, curated specifically for your skin's unique needs.</p>
          </div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          {/* Brand Identity */}
          <div className={styles.brandLogo}>
            <Link href="/">
              <img src="/logo_fixed.png" alt="Beauty Bees Cosmetics" />
            </Link>
          </div>

          <div className={styles.mobileLogo}>
             Beauty Bees Cosmetics
          </div>

          <div className={styles.formHeader}>
            <h1>
              {authState === 'LOGIN' ? 'Sign In' : authState === 'VERIFY' ? 'Confirm Identity' : 'Secure Login'}
            </h1>
            <p>
              {authState === 'LOGIN' 
                ? 'Welcome back to Beauty Bees Cosmetics. Your beauty journey continues here.' 
                : `A verification code has been sent to ${email}`}
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          {authState === 'LOGIN' ? (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label>Password</label>
                  <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.rememberRow}>
                <label className={styles.rememberLabel}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  Keep me signed in for 30 days
                </label>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? <div className={styles.spinner}></div> : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Verification Code</label>
                <div className={styles.otpContainer}>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className={styles.otpInput}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? <div className={styles.spinner}></div> : 'Verify & Continue'}
              </button>

              <div className={styles.resendArea}>
                <button 
                  type="button" 
                  className={styles.resendBtn} 
                  onClick={handleResendCode} 
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
                </button>
              </div>
              
              <button type="button" className={styles.backBtn} onClick={() => setAuthState('LOGIN')}>
                <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Sign In
              </button>
            </form>
          )}

          {authState === 'LOGIN' && (
            <>
              <div className={styles.divider}><span>or</span></div>
              <button className={styles.guestBtn} onClick={() => router.push('/shop')}>
                Browse as Guest
              </button>
              <p className={styles.switchAuth}>
                New to Beauty Bees Cosmetics? <Link href="/register">Create an account</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
