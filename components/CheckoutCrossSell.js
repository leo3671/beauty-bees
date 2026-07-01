"use client";

import { useCart } from '../lib/CartContext';
import { useProducts } from '../lib/ProductContext';

export default function CheckoutCrossSell() {
  const { cartItems = [], setCartItems } = useCart() || {};
  const { products } = useProducts();

  if (!cartItems || cartItems.length === 0 || !products) return null;

  const cartIds = cartItems.map(item => item.id);
  const availableCrossSells = products.filter(p => !cartIds.includes(p.id));

  if (availableCrossSells.length === 0) return null;

  const recommendations = availableCrossSells
    .sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
    .slice(0, 2);

  const handleAdd = (product) => {
    if (setCartItems) setCartItems(prev => [...prev, product]);
  };

  return (
    <div className="my-6 p-4 bg-bb-peach/50 rounded-2xl border border-bb-border/40">
      <h3 className="font-heading text-base font-bold text-bb-heading mb-4">Frequently Bought Together</h3>
      <div className="flex flex-col gap-3">
        {recommendations.map(product => (
          <div key={product.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-bb-border/30">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-bb-heading truncate">{product.name}</p>
              <p className="text-sm text-bb-pink font-bold">Rs. {product.price}</p>
            </div>
            <button
              className="flex-shrink-0 bg-bb-pink text-white text-xs font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer
                hover:bg-bb-pink-hover transition-colors"
              onClick={() => handleAdd(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
