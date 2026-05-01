"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user.role === 'admin') {
            router.replace('/admin/dashboard');
          } else {
            router.replace('/login');
          }
        } else {
          router.replace('/admin/login');
        }
      } catch (e) {
        router.replace('/admin/login');
      }
    };
    checkAdmin();
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary-pink)',
          borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 20px'
        }}></div>
        <p style={{ color: '#64748b' }}>Authenticating admin access...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
