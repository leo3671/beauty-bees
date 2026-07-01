"use client";

import { useCart } from '../lib/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AddToCartButton({ product }) {
  const { setCartItems, openCart } = useCart() || {};

  const handleAdd = () => {
    if (setCartItems && openCart) {
      if (product.stock <= 0) {
        toast.error('Sorry, this product is out of stock!');
        return;
      }
      setCartItems(prev => [...prev, product]);
      toast.success(`${product.name} added to cart!`, { icon: '🐝' });
      openCart();
    }
  };

  return (
    <Button
      onClick={handleAdd}
      className="w-full bg-bb-heading text-white hover:bg-bb-text font-bold text-sm py-3 h-auto rounded-xl"
    >
      Add to Cart — Rs. {product.price}
    </Button>
  );
}
