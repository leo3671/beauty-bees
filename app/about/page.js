export default function About() {
  return (
    <div className="bg-bb-bg min-h-screen">
      <section className="py-20 text-center bg-bb-peach/50 border-b border-bb-border/30">
        <div className="container mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">OUR STORY</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-bb-heading mb-6">Authentic K-Beauty for Nepal</h1>
          <p className="max-w-[800px] mx-auto text-base md:text-lg leading-relaxed text-bb-text/80">
            Beauty Bees Cosmetics was born from a simple realization: finding 100% authentic Korean skincare in Nepal shouldn&apos;t be a challenge. We are dedicated to bringing you the gold standard of skincare—directly from Seoul to your doorstep.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-bb-peach/10 p-8 rounded-2xl border border-bb-border/20">
            <h2 className="font-heading text-2xl font-bold text-bb-heading mb-4">Our Mission</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              We empower our customers to achieve their best skin through education and access to high-performance, dermatologist-tested products. Every brand in our catalog is carefully vetted for efficacy and authenticity.
            </p>
          </div>
          <div className="bg-bb-peach/10 p-8 rounded-2xl border border-bb-border/20">
            <h2 className="font-heading text-2xl font-bold text-bb-heading mb-4">Why &quot;Beauty Bees Cosmetics&quot;?</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Just like bees carefully curate the best nectar to create honey, we meticulously select the best skincare innovations from South Korea to bring you sweetness and glow for your skin journey.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-bb-bg text-center border-t border-bb-border/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img src="/images/kbeauty_brands.png" alt="Our Brands" className="w-full h-auto rounded-2xl shadow-md mb-8 border border-bb-border/30" />
            <h2 className="font-heading text-2xl font-bold text-bb-heading mb-3">100% Authentic. Always.</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">We source directly from official brand distributors in South Korea. No middlemen, no fakes, just the real deal.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
