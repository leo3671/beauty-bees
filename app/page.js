import Link from "@/components/OptimizedLink";
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

      {/* ─── VIP WHATSAPP GROUP ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#128C7E] to-[#075E54] py-16 px-6 text-center text-white">
        <div className="max-w-[560px] mx-auto">
          <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-[0.7rem] font-bold tracking-[2px] uppercase mb-4">
            EXCLUSIVES & ALERTS
          </span>
          <h2 className="font-heading text-2xl md:text-[2rem] font-medium mb-3">
            Join our VIP WhatsApp Group
          </h2>
          <p className="text-white/85 mb-8 text-[0.95rem] leading-[1.6]">
            Get instant restock notifications, flash sale alerts, and personalized skin consultation directly on WhatsApp.
          </p>
          <a
            href="https://chat.whatsapp.com/example-beauty-bees-vip"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#075E54] px-9 py-4 rounded-full font-bold text-base
              shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:scale-102 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]
              transition-all duration-300 no-underline"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436 0 9.86-4.426 9.864-9.864.002-2.63-1.023-5.105-2.887-6.97C16.38 1.897 13.9 .872 11.267.872c-5.442 0-9.87 4.43-9.873 9.87-.001 2.012.518 3.666 1.5 5.097L1.874 22.03l6.402-1.681-.629-.379-.6-.361zm11.583-7.859c-.315-.158-1.86-.918-2.142-1.02-.283-.103-.488-.155-.693.158-.205.312-.79.992-.968 1.198-.18.206-.359.232-.674.074-.315-.158-1.33-.49-2.532-1.562-.936-.83-1.568-1.856-1.751-2.172-.183-.315-.02-.485.138-.642.142-.142.315-.368.473-.553.158-.185.21-.316.315-.528.105-.21.053-.395-.026-.553-.079-.158-.693-1.67-.95-2.288-.25-.6-.525-.515-.72-.525-.18-.01-.385-.01-.59-.01-.205 0-.538.077-.82.385-.282.309-1.078 1.055-1.078 2.573 0 1.517 1.102 2.985 1.256 3.193.154.208 2.17 3.31 5.257 4.639.734.316 1.307.505 1.754.647.737.233 1.407.2 1.938.12.593-.09 1.86-.761 2.122-1.46.262-.7.262-1.298.185-1.423-.078-.125-.283-.207-.597-.365z"/>
            </svg>
            Join VIP WhatsApp Group
          </a>
        </div>
      </section>

    </div>
  );
}
