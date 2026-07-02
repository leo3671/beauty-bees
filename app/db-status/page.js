import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DBStatusPage() {
  let status = 'Checking...';
  let details = '';
  let color = '#64748b';
  let userCount = 0;

  try {
    // Try to count users as a connectivity test
    userCount = await prisma.user.count();
    status = 'Connected Successfully! ✅';
    details = `Successfully reached Supabase. Found ${userCount} users in the database.`;
    color = '#22c55e';
  } catch (error) {
    status = 'Connection Failed ❌';
    details = error.message;
    color = '#ef4444';
  }

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'sans-serif', 
      maxWidth: '600px', 
      margin: '100px auto',
      textAlign: 'center',
      backgroundColor: '#f8fafc',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: color, marginBottom: '20px' }}>Database Status</h1>
      <div style={{ 
        fontSize: '1.2rem', 
        fontWeight: 'bold', 
        padding: '20px', 
        background: 'white', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        {status}
      </div>
      <p style={{ color: '#475569', lineHeight: '1.6', wordBreak: 'break-all' }}>
        {details}
      </p>
      
      <div style={{ marginTop: '30px', padding: '15px', borderTop: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          If this is RED, check your <strong>DATABASE_URL</strong> in Vercel Settings.
        </p>
        <Link href="/" style={{ 
          display: 'inline-block', 
          marginTop: '20px', 
          color: 'var(--primary-pink)', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
