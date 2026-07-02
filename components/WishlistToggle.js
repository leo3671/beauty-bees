"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function WishlistToggle({ productId, className }) {
  const { user } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const checkWishlist = async () => {
      try {
        const res = await fetch('/api/user/wishlist');
        if (res.ok) {
          const data = await res.json();
          const found = data.items.some(item => item.id === productId);
          setInWishlist(found);
        }
      } catch (e) {
        console.error("Failed to check wishlist status", e);
      }
    };
    checkWishlist();
  }, [productId, user]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to add to your wishlist');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (res.ok) {
        setInWishlist(data.added);
        if (data.added) {
          toast.success('Added to wishlist!', { icon: '💖' });
        } else {
          toast.success('Removed from wishlist');
        }
      } else {
        toast.error(data.error || 'Failed to update wishlist');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "p-2 rounded-full border border-slate-200 bg-white/90 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-sm",
        inWishlist ? "text-red-500 border-red-100 bg-red-50/40" : "text-slate-400 hover:text-red-500",
        className
      )}
      aria-label="Toggle Wishlist"
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill={inWishlist ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
