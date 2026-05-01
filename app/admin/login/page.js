"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login success
    if (email === 'admin@beautybees.com.np' && password === 'admin123') {
      alert('Login Successful!');
      router.push('/admin/dashboard');
    } else {
      alert('Invalid credentials. Use admin@beautybees.com.np / admin123');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Beauty Bees Admin</h2>
        <p>Log in to manage your store.</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@beautybees.com.np" 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="admin123" 
              required 
            />
          </div>
          <button type="submit" className={styles.loginBtn}>Sign In</button>
        </form>
      </div>
    </div>
  );
}
