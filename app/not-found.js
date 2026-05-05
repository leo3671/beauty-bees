import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #fff8f9 0%, #ffffff 100%)'
    }}>
      <div style={{ maxWidth: '500px' }}>
        <span style={{ 
          fontSize: '120px', 
          display: 'block', 
          marginBottom: '20px',
          opacity: 0.8
        }}>🐝</span>
        <h1 style={{ 
          fontSize: '3rem', 
          color: '#4a3b3e', 
          marginBottom: '16px',
          fontFamily: 'var(--font-heading)'
        }}>Oops! Page Not Found</h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#8a7b7e', 
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          It seems the beauty routine you're looking for doesn't exist. Let's get you back to finding your perfect glow.
        </p>
        <Link href="/shop" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#be185d',
          color: 'white',
          padding: '14px 32px',
          borderRadius: '999px',
          textDecoration: 'none',
          fontWeight: '600',
          boxShadow: '0 10px 20px rgba(190, 24, 93, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    </div>
  );
}
