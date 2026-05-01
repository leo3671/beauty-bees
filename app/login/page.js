"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authState, setAuthState] = useState('LOGIN'); // LOGIN, VERIFY, MFA
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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

      if (res.ok) {
        if (data.requiresMFA) {
          setAuthState('MFA');
          toast.success('MFA code sent to your email');
        } else {
          router.push(data.role === 'admin' ? '/admin/dashboard' : '/account');
        }
      } else {
        if (data.requiresVerification) {
          setAuthState('VERIFY');
          toast.error('Email not verified. Verification code sent.');
        } else {
          setError(data.error || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
        toast.success(authState === 'VERIFY' ? 'Email verified!' : 'MFA Success!');
        router.push(data.role === 'admin' ? '/admin/dashboard' : '/account');
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.imageSide}>
        <img src="/images/kbeauty_products.png" alt="Popular K-Beauty Products" className={styles.heroImage} />
        <div className={styles.imageOverlay}>
          <div className={styles.imageContent}>
            <div className={styles.logoMark}>🐝</div>
            <h2>Welcome to<br/>Beauty Bees</h2>
            <p>Your trusted destination for authentic Korean skincare in Nepal.</p>
          </div>
        </div>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.mobileLogo}><span>🐝</span> Beauty Bees</div>

          <div className={styles.formHeader}>
            <h1>{authState === 'LOGIN' ? 'Sign In' : authState === 'VERIFY' ? 'Verify Email' : 'MFA Verification'}</h1>
            <p>
              {authState === 'LOGIN' 
                ? 'Welcome back! Please enter your details.' 
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          {authState === 'LOGIN' ? (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                  <label>Password</label>
                  <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '4px' }}
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              
              <button type="button" className={styles.backBtn} onClick={() => setAuthState('LOGIN')}>
                Back to Login
              </button>
            </form>
          )}

          {authState === 'LOGIN' && (
            <>
              <div className={styles.divider}><span>or</span></div>
              <button className={styles.guestBtn} onClick={() => router.push('/shop')}>Continue as Guest</button>
              <p className={styles.switchAuth}>
                Don't have an account? <Link href="/register">Create one</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
