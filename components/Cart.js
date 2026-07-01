"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../lib/CartContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Cart({ isOpen, onClose }) {
  const { cartItems = [], setCartItems } = useCart() || {};

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }
    return () => document.body.classList.remove('cart-open');
  }, [isOpen]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[1999] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 w-[450px] max-sm:w-[95%] h-full bg-white z-[2000]",
          "flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)]",
          "transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-bold tracking-tight text-bb-heading">Beauty Bees Cosmetics</h2>
          <button
            className="p-2 text-slate-500 hover:text-bb-heading transition-colors bg-transparent border-none cursor-pointer rounded-lg hover:bg-bb-peach"
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          {cartItems.length === 0 ? (
            <div className="text-center pt-16">
              <div className="text-6xl mb-6 opacity-50">🛍️</div>
              <h3 className="text-[1.4rem] font-heading font-semibold mb-2 text-bb-heading">Your cart is currently empty.</h3>
              <p className="text-slate-500 mb-8 text-sm">Find something you love and start shopping!</p>
              <Button
                onClick={onClose}
                className="bg-bb-heading text-white hover:bg-bb-text px-7 py-3 rounded-xl font-semibold h-auto"
              >
                Shop our Best Sellers
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-black/[0.03]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[0.95rem] font-semibold mb-2 text-bb-heading truncate">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-bb-heading">
                        Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                      </span>
                      <div className="flex items-center bg-slate-100 rounded-full px-1 py-1 gap-3">
                        <button
                          className="bg-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer border-none hover:bg-bb-peach transition-colors active:scale-90"
                          onClick={() => {
                            const newItems = [...cartItems];
                            if ((newItems[index].quantity || 1) > 1) {
                              newItems[index].quantity = (newItems[index].quantity || 1) - 1;
                              setCartItems(newItems);
                            }
                          }}
                        >−</button>
                        <span className="text-[0.9rem] font-bold min-w-[20px] text-center">{item.quantity || 1}</span>
                        <button
                          className="bg-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer border-none hover:bg-bb-peach transition-colors active:scale-90"
                          onClick={() => {
                            const newItems = [...cartItems];
                            newItems[index].quantity = (newItems[index].quantity || 1) + 1;
                            setCartItems(newItems);
                          }}
                        >+</button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="p-3 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
                    onClick={() => {
                      const newItems = [...cartItems];
                      newItems.splice(index, 1);
                      setCartItems(newItems);
                    }}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between text-[1.1rem] font-bold mb-2 text-bb-heading">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <p className="text-[0.85rem] text-slate-500 mb-6">Taxes and shipping calculated at checkout.</p>
          <Link
            href="/checkout"
            onClick={onClose}
            className="flex justify-center items-center bg-bb-heading text-white no-underline py-[18px] rounded-[14px] font-bold text-base
              transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] animate-pulse-gentle
              hover:bg-black hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
