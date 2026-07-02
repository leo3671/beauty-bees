"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 75,
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback placeholder image on load error or if no src is provided
  const imageSrc = error || !src ? '/logo_fixed.png' : src;

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-slate-100/50 flex items-center justify-center w-full h-full",
        loading && !priority && "animate-pulse",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt || "Product image"}
        width={!fill ? width || 400 : undefined}
        height={!fill ? height || 400 : undefined}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        className={cn(
          "transition-opacity duration-300 ease-in-out",
          loading && !priority ? "opacity-0" : "opacity-100"
        )}
        style={fill ? { objectFit: 'contain' } : undefined}
        {...props}
      />
    </div>
  );
}
