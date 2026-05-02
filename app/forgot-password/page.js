"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/page.module.css';
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
    <div className={styles.authPage}>
      <div className={styles.formSide} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div className={styles.formContainer} style={{ maxWidth: '450px' }}>
          <div className={styles.formHeader}>
            <h1>Forgot Password?</h1>
            <p>Enter your email address to receive a reset code.</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
          <p className={styles.switchAuth}>
            Remembered your password? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
