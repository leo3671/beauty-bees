"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the account page and activate the orders tab
    router.replace('/account?tab=orders');
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting to your orders...</p>
    </div>
  );
}
