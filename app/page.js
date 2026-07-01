import Link from "next/link";
import Image from "next/image";
import HomeProductTabs from "../components/HomeProductTabs";
import ShopByCategory from "../components/ShopByCategory";
import Recommendations from "../components/Recommendations";
import ShopByBrand from "../components/ShopByBrand";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Beauty Bees Cosmetics | Authentic K-Beauty in Nepal",
  description: "Discover premium Korean skincare and beauty products. Authentic brands, fast delivery across Nepal.",
};

export default async function Home() {
  let brands = [];
  try {
    const brandProducts = await prisma.product.findMany({
      select: { brand: true, image: true },
      distinct: ['brand'],
      take: 3
    });
    brands = brandProducts.map(p => ({ name: p.brand, img: p.image }));
  } catch (e) {
    console.error("Failed to fetch brands", e);
  }

  return (
    <div>
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-bb-bg to-bb-peach overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[600px]">
          {/* Image side */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
            <Image
              src="/images/hero_banner_secondary.png"
              alt="K-Beauty Collection"
              width={800}
              height={600}
              priority
              className="w-full max-w-[550px] h-auto object-cover rounded-2xl shadow-[0_20px_60px_rgba(74,59,62,0.15)] animate-[float_6s_ease-in-out_infinite]"
              style={{}}
            />
          </div>

          {/* Text side */}
          <div className="flex-1 flex flex-col justify-center px-6 py-10 md:px-10 md:py-[60px] md:pr-20">
            <span className="inline-block bg-bb-pink text-white px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[2px] uppercase mb-5 w-fit">
              NEW COLLECTION
            </span>
            <h1 className="font-heading text-[2.2rem] md:text-[3.2rem] font-semibold text-bb-text leading-tight tracking-tight mb-5">
              Your Skin Deserves<br />Korean Excellence
            </h1>
            <p className="text-[1rem] text-[#6b5b5e] leading-[1.7] mb-8 max-w-[480px]">
              Discover our handpicked selection of premium K-Beauty products. From serums to sunscreens — everything your skin craves.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-block bg-bb-pink text-white px-9 py-3.5 text-[0.95rem] font-semibold rounded-full no-underline
                  shadow-[0_4px_14px_rgba(242,182,193,0.4)] hover:bg-bb-pink-hover hover:-translate-y-0.5
                  hover:shadow-[0_6px_20px_rgba(242,182,193,0.6)] transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ───────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 border-y border-bb-border bg-white">
        {[
          { icon: '✈️', title: 'Free Shipping',     sub: 'On orders over Rs. 10,000' },
          { icon: '🔒', title: '100% Authentic',    sub: 'Directly from South Korea' },
          { icon: '📦', title: 'Fast Delivery',     sub: '2-5 days across Nepal' },
          { icon: '💖', title: 'Expert Curation',   sub: 'Hand-picked for your skin' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 py-5 border-r border-bb-border last:border-r-0 border-b md:border-b-0 md:justify-center"
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div className="flex flex-col">
              <strong className="text-[0.85rem] text-bb-text font-semibold mb-0.5">{item.title}</strong>
              <span className="text-[0.75rem] text-slate-400">{item.sub}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ─── RECOMMENDATIONS ─────────────────────────────────────── */}
      <Recommendations />

      {/* ─── SHOP BY BRAND ───────────────────────────────────────── */}
      <ShopByBrand />

      {/* ─── SHOP BY CATEGORY ────────────────────────────────────── */}
      <section className="container py-8">
        <div className="text-center mb-8">
          <span className="text-[0.7rem] font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">BROWSE</span>
          <h2 className="font-heading text-2xl md:text-[2.5rem] font-medium text-bb-text mb-2">Shop by Category</h2>
          <p className="text-slate-400 text-[0.95rem]">Find the perfect step for your routine</p>
        </div>
        <ShopByCategory />
      </section>

      {/* ─── CURATED COLLECTIONS TABS ────────────────────────────── */}
      <section className="container py-12 md:py-20">
        <div className="text-center mb-10">
          <span className="text-[0.7rem] font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">CURATED</span>
          <h2 className="font-heading text-2xl md:text-[2.5rem] font-medium text-bb-text mb-2">Our Collections</h2>
          <p className="text-slate-400 text-[0.95rem]">Explore our best sellers and newest arrivals</p>
        </div>
        <HomeProductTabs />
      </section>

      {/* ─── FULL WIDTH IMAGE BANNER ──────────────────────────────── */}
      <section className="relative h-[450px] md:h-[500px] overflow-hidden">
        <img
          src="/images/hero_banner_main.png"
          alt="Beauty Bees Cosmetics Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6">
          <h2 className="font-heading text-2xl md:text-[2.8rem] text-white font-medium mb-4">
            Science Meets Beauty
          </h2>
          <p className="text-white/85 max-w-[550px] leading-[1.7] mb-8 text-[0.95rem]">
            Every product in our store is backed by Korean dermatological research and loved by millions worldwide.
            We bring you the latest innovations in skincare technology from the heart of Seoul.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-white text-bb-text px-9 py-3.5 rounded-full font-semibold text-[0.95rem] no-underline
              shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
              transition-all duration-300"
          >
            Explore All Products
          </Link>
        </div>
      </section>

      {/* ─── WHY BEAUTY BEES ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-[0.7rem] font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">WHY US</span>
            <h2 className="font-heading text-2xl md:text-[2.5rem] font-medium text-bb-text">
              The Beauty Bees Cosmetics Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { icon: '🇰🇷', title: 'Direct from Korea',     body: 'We source directly from official Korean distributors. Zero middlemen, zero counterfeits. 100% authenticity guaranteed.' },
              { icon: '🧪', title: 'Dermatologist Tested', body: 'Every brand in our catalog is clinically tested and approved by Korean dermatologists for sensitive skin.' },
              { icon: '🌿', title: 'Clean Ingredients',    body: 'No parabens, no sulfates, no animal testing. Just pure, effective skincare derived from nature.' },
              { icon: '💬', title: 'Expert Support',       body: 'Not sure what to buy? Our skincare experts and AI assistant Bee help you find the perfect routine for your skin.' },
            ].map(card => (
              <div
                key={card.title}
                className="text-center p-8 rounded-xl border border-transparent transition-all duration-300
                  hover:bg-bb-bg hover:border-bb-border hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-heading text-[1.1rem] font-semibold text-bb-text mb-2.5">{card.title}</h3>
                <p className="text-slate-400 text-[0.9rem] leading-[1.6]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-bb-text to-[#5a4a4d] py-16 px-6">
        <div className="max-w-[560px] mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-[2rem] text-white font-medium mb-3">
            Join the Beauty Bees Cosmetics Family
          </h2>
          <p className="text-white/70 mb-8 text-[0.95rem]">
            Subscribe for exclusive drops, skincare tips, and members-only discounts.
          </p>
          <div className="flex gap-3 mb-4 max-sm:flex-col">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-full border-none bg-white/15 text-white outline-none
                backdrop-blur-[10px] placeholder:text-white/50 focus:bg-white/25 transition-colors"
            />
            <button
              className="px-8 py-3.5 bg-bb-pink text-white border-none rounded-full font-semibold text-[0.9rem]
                hover:bg-bb-pink-hover hover:-translate-y-px transition-all duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
          <small className="text-white/40 text-[0.8rem]">No spam. Unsubscribe anytime. 🐝</small>
        </div>
      </section>

    </div>
  );
}
