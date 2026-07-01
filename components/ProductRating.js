"use client";

import { useState, useEffect } from 'react';
import StarRating from './StarRating';

export default function ProductRating({ productId, showCount = true }) {
  const [rating, setRating] = useState(0);
  const [count, setCount]   = useState(0);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const avg = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
          setRating(Math.round(avg));
          setCount(data.length);
        }
      })
      .catch(console.error);
  }, [productId]);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1.5 my-1">
      <StarRating initialRating={rating} readOnly={true} />
      {showCount && (
        <span className="text-xs text-slate-500 font-medium">({count})</span>
      )}
    </div>
  );
}
