"use client";

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import { useCart } from '../lib/CartContext';

const Cart = dynamic(() => import('./Cart'), { ssr: false });

import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  const { isCartOpen, closeCart } = useCart() || {};
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <Toaster position="top-right" />
        <main>{children}</main>
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-left" toastOptions={{ duration: 3000 }} />
      <Header />
      {closeCart && <Cart isOpen={isCartOpen} onClose={closeCart} />}
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}
