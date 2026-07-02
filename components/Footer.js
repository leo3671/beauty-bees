import Link from './OptimizedLink';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-bb-bg border-t border-bb-border/40 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="relative h-[50px] w-[150px] mb-4">
              <Image
                src="/logo_fixed.png"
                alt="Beauty Bees Cosmetics"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="text-sm text-bb-text/70 leading-relaxed max-w-[200px]">
              Your destination for authentic Korean beauty in Nepal. We believe in gentle, effective skincare.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading font-semibold text-bb-heading text-sm uppercase tracking-wider mb-4">Shop</h3>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { href: '/shop?category=skincare', label: 'Skincare' },
                { href: '/shop?category=makeup',   label: 'Makeup' },
                { href: '/shop?filter=best-seller',label: 'Best Sellers' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-bb-text/70 hover:text-bb-pink transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="font-heading font-semibold text-bb-heading text-sm uppercase tracking-wider mb-4">Contact & Info</h3>
            <ul className="flex flex-col gap-2.5 list-none">
              {[
                { href: '/about',   label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/faq',     label: 'FAQ' },
                { href: '/terms',   label: 'Terms & Privacy' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-bb-text/70 hover:text-bb-pink transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-semibold text-bb-heading text-sm uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/beautybees_np?igsh=aXp6cWduaWt2NHZt"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-bb-text/60 hover:text-bb-pink transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@beautybees_np?_r=1&_t=ZS-95z89RZ9eJF"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="text-bb-text/60 hover:text-bb-pink transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-bb-border/40" />

      <div className="container py-5 text-center">
        <p className="text-xs text-bb-text/50">
          &copy; {new Date().getFullYear()} Beauty Bees Cosmetics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
