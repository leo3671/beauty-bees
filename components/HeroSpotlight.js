import Link from 'next/link';

export default function HeroSpotlight() {
  return (
    <section className="container my-8 md:my-12">
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden bg-gradient-to-br from-bb-peach to-bb-bg border border-bb-border/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        {/* Image side */}
        <div className="md:w-[45%] relative overflow-hidden min-h-[260px] md:min-h-[360px]">
          <img
            src="/images/skin1004_ampoule.jpg"
            alt="Skin1004 Centella Ampoule"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Content side */}
        <div className="md:w-[55%] flex flex-col justify-center px-8 py-10 md:px-12">
          <span className="inline-block mb-4 px-3 py-1 bg-bb-pink text-white text-xs font-bold uppercase tracking-widest rounded-full w-fit">
            Global Best Seller
          </span>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-bb-heading leading-tight mb-4">
            Skin1004 Madagascar Centella Asiatica Ampoule
          </h3>
          <p className="text-bb-text/80 text-[0.95rem] leading-relaxed mb-6">
            Experience the miracle of 100% pure Centella Asiatica extract from Madagascar.
            Instantly soothes inflamed skin and provides deep, lasting hydration. A viral sensation worldwide.
          </p>
          <div className="mb-6">
            <span className="text-2xl font-bold text-bb-pink">रु 2,300</span>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-bb-heading text-white font-bold text-sm px-8 py-3.5 rounded-xl 
              hover:bg-bb-text transition-colors duration-200 w-fit no-underline"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
