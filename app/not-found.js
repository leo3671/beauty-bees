import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 text-center bg-gradient-to-br from-bb-bg to-white">
      <div className="max-w-[500px] w-full">
        <span className="text-8xl block mb-5 opacity-80">🐝</span>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-bb-heading mb-4">Oops! Page Not Found</h1>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
          It seems the beauty routine you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to finding your perfect glow.
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center gap-2 bg-bb-pink hover:bg-bb-pink-hover text-white font-bold px-8 py-3.5 rounded-full no-underline shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    </div>
  );
}
