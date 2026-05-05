"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import styles from './page.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authState, setAuthState] = useState('REGISTER'); // REGISTER, VERIFY
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
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
      if (res.ok) {
        toast.success('New code sent to your email');
        startResendTimer();
      }
    } catch (err) {
      setError('Failed to resend code');
    } finally {
      setLoading(false);
    }
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
      if (res.ok) {
        toast.success('Email verified!');
        router.push('/account');
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) score++;
    
    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 4) return { score, label: 'Good', color: '#3b82f6' };
    return { score, label: 'Strong', color: '#16a34a' };
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (strength.score < 4) {
      setError('Password must contain uppercase, lowercase, number, and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

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
          if (data.devOTP) {
            toast.success(`DEV MODE: Your code is ${data.devOTP}`, { duration: 10000 });
          } else {
            toast.success('Account created! Please enter verification code.');
          }
        } else {
          router.push('/account');
        }
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Left Side — Products */}
      <div className={styles.imageSide}>
        <img src="/images/kbeauty_products.png" alt="Popular K-Beauty Products" className={styles.heroImage} />
        <div className={styles.imageOverlay}>
          <div className={styles.imageContent}>
            <div className={styles.logoMark}>🐝</div>
            <h2>Join the<br/>Beauty Bees Cosmetics Family</h2>
            <p>Create your account for a personalized skincare experience, order tracking, and exclusive member deals.</p>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.mobileLogo}>
            <span>🐝</span> Beauty Bees Cosmetics
          </div>

          <div className={styles.formHeader}>
            <h1>{authState === 'REGISTER' ? 'Create Account' : 'Verify Email'}</h1>
            <p>
              {authState === 'REGISTER' 
                ? 'Start your K-Beauty journey today.' 
                : `We've sent a 6-digit code to your email.`}
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          {authState === 'REGISTER' ? (
            <form onSubmit={handleRegister} className={styles.form}>
              {/* Full Name */}
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required autoComplete="name" />
                </div>
              </div>

              {/* Email */}
              <div className={styles.inputGroup}>
                <label htmlFor="reg-email">Email</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" />
                </div>
              </div>

              {/* Phone Number */}
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone Number</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" required autoComplete="tel" />
                </div>
              </div>

              {/* Password */}
              <div className={styles.inputGroup}>
                <label htmlFor="reg-password">Password</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, uppercase, number, symbol"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M1 12s4-8 11-8 11-8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password Strength Meter */}
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{
                          flex: 1, height: '4px', borderRadius: '2px',
                          backgroundColor: i <= strength.score ? strength.color : '#e8dfe0',
                          transition: 'all 0.3s ease'
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75em', color: strength.color, fontWeight: '600' }}>{strength.label}</span>
                      <div style={{ fontSize: '0.7em', color: '#94a3b8' }}>
                        {password.length < 8 && <span>8+ chars </span>}
                        {!/[A-Z]/.test(password) && <span>• A-Z </span>}
                        {!/[0-9]/.test(password) && <span>• 0-9 </span>}
                        {!/[!@#$%^&*]/.test(password) && <span>• !@# </span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={styles.inputGroup}>
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    autoComplete="new-password"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span style={{ fontSize: '0.75em', color: '#ef4444', marginTop: '4px', display: 'block' }}>Passwords do not match</span>
                )}
                {confirmPassword && password === confirmPassword && (
                  <span style={{ fontSize: '0.75em', color: '#16a34a', marginTop: '4px', display: 'block' }}>✓ Passwords match</span>
                )}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <span className={styles.spinner}></span>
                ) : (
                  'Create Account'
                )}
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

              <div className={styles.resendArea}>
                <button 
                  type="button" 
                  className={styles.resendBtn} 
                  onClick={handleResend} 
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
              
              <button type="button" className={styles.backBtn} onClick={() => setAuthState('REGISTER')}>
                Back to Registration
              </button>
            </form>
          )}

          <p className={styles.switchAuth}>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
