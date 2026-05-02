"use client";

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import styles from './ProductRating.module.css';

export default function ProductRating({ productId, showCount = true }) {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);

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

  return (
    <div className={styles.container}>
      <StarRating initialRating={rating} readOnly={true} />
      {showCount && count > 0 && <span className={styles.count}>({count})</span>}
    </div>
  );
}
