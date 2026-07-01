"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export default function StarRating({ initialRating = 0, onRatingChange, readOnly = false }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover]   = useState(0);

  const handleClick = (value) => {
    if (readOnly) return;
    setRating(value);
    if (onRatingChange) onRatingChange(value);
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          disabled={readOnly}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          className={cn(
            "bg-transparent border-none p-0 cursor-pointer transition-colors duration-150",
            readOnly && "cursor-default",
            (hover || rating) >= star ? "text-amber-400" : "text-slate-200"
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}
