"use client";
import Link from 'next/link';
import { useEffect } from 'react';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl border border-bb-border/30 shadow-md text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle className="text-green-500 w-10 h-10" />
        </div>
        
        <h1 className="font-heading text-2xl font-bold text-bb-heading mb-2">Thank You for Your Order!</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Your order has been placed successfully and is now being processed. 
          We&apos;ve sent a confirmation email to your inbox.
        </p>

        <div className="w-full space-y-4 mb-8 bg-bb-bg/50 border border-bb-border/20 rounded-xl p-4 text-left">
          <div className="flex items-start gap-3">
            <Package className="text-bb-pink w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-bb-heading">Order Confirmed</strong>
              <p className="text-xs text-slate-500">Items are being packed</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="text-bb-pink w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-semibold text-bb-heading">Delivery</strong>
              <p className="text-xs text-slate-500">Arriving in 2-5 business days</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link href="/account" className="w-full py-3.5 bg-bb-heading text-white rounded-xl font-semibold hover:bg-bb-text transition-colors flex items-center justify-center gap-2 no-underline">
            Track My Order <ArrowRight size={18} />
          </Link>
          <Link href="/shop" className="w-full py-3.5 bg-white text-bb-text border border-bb-border rounded-xl font-medium hover:bg-bb-bg transition-colors flex items-center justify-center no-underline">
            Continue Shopping
          </Link>
        </div>

        <div className="mt-6 text-xs text-slate-400">
          Need help? <Link href="/contact" className="text-bb-pink hover:underline">Contact our support team</Link>
        </div>
      </div>
    </div>
  );
}
