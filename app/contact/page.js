"use client";

import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-bb-bg min-h-screen">
      <section className="py-20 text-center bg-bb-peach/50 border-b border-bb-border/30">
        <div className="container mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">GET IN TOUCH</span>
          <h1 className="font-heading text-4xl font-bold text-bb-heading mb-4">We&apos;re Here to Help</h1>
          <p className="text-slate-500 text-base max-w-md mx-auto">Have a question about a product or your order? Reach out to our skincare experts.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-bb-border/30 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-bb-peach rounded-full flex items-center justify-center mb-5 text-bb-pink">
              <Mail size={22} />
            </div>
            <h3 className="font-heading font-bold text-bb-heading text-base mb-2">Email Us</h3>
            <p className="text-sm text-slate-500 font-semibold">beautybeesnp@gmail.com</p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-bb-border/30 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-bb-peach rounded-full flex items-center justify-center mb-5 text-bb-pink">
              <Phone size={22} />
            </div>
            <h3 className="font-heading font-bold text-bb-heading text-base mb-2">Call Us</h3>
            <p className="text-sm text-slate-500 font-semibold">9867772341</p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-bb-border/30 shadow-sm text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-bb-peach rounded-full flex items-center justify-center mb-5 text-bb-pink">
              <MessageSquare size={22} />
            </div>
            <h3 className="font-heading font-bold text-bb-heading text-base mb-2">WhatsApp</h3>
            <a 
              href="https://wa.me/9779867772341" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-bb-pink font-semibold hover:underline no-underline"
            >
              Direct Message
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-bb-border/30">
        <div className="container mx-auto px-4">
          <div className="p-8 bg-bb-bg/40 rounded-2xl border border-bb-border/30 text-center flex flex-col items-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-bb-peach rounded-full flex items-center justify-center mb-5 text-bb-pink">
              <MapPin size={22} />
            </div>
            <h3 className="font-heading font-bold text-bb-heading text-base mb-2">Our Location</h3>
            <p className="text-sm text-slate-500 font-semibold">New Baneshwor, Kathmandu, Nepal</p>
            <p className="text-xs text-slate-400 mt-2">Visit us for authentic Korean skincare consultation.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-[640px]">
          <div className="bg-white p-8 md:p-12 rounded-2xl border border-bb-border/30 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-bb-heading mb-8 text-center">Send us a Message</h2>
            <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" />
                <input type="email" placeholder="Email Address" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" />
              </div>
              <input type="text" placeholder="Subject" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all" />
              <textarea placeholder="How can we help you?" rows="5" className="w-full bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all resize-none"></textarea>
              <button type="submit" className="w-full bg-bb-heading hover:bg-bb-text text-white font-bold py-3.5 rounded-xl border-none cursor-pointer shadow-sm transition-colors mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
