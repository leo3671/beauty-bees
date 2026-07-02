"use client";

import Link from 'next/link';

export default function OptimizedLink({ href, children, prefetch = false, ...props }) {
  return (
    <Link href={href} prefetch={prefetch} {...props}>
      {children}
    </Link>
  );
}
