"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "Are your products 100% authentic?",
    a: "Yes, absolutely. We source all our products directly from official brand distributors in South Korea. We guarantee 100% authenticity for every single item in our store."
  },
  {
    q: "How long does shipping take within Nepal?",
    a: "We offer fast delivery across Nepal. Within Kathmandu Valley, you can expect your order in 1-2 business days. For outside the valley, it typically takes 3-5 business days."
  },
  {
    q: "Do you offer consultations for skin routines?",
    a: "Yes! You can use our AI chatbot 'Bee' for instant advice, or contact us via WhatsApp to speak with a human skincare expert who can help curate a routine for your specific skin type."
  },
  {
    q: "What is your return policy?",
    a: "Due to the nature of skincare products and for hygiene reasons, we only accept returns for items that are damaged during transit or if the wrong product was delivered. Please contact us within 24 hours of delivery."
  },
  {
    q: "Is COD (Cash on Delivery) available?",
    a: "Yes, we offer Cash on Delivery for orders within Kathmandu Valley. For outside valley orders, we require pre-payment via Fonepay or bank transfer."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-bb-bg min-h-screen">
      <section className="py-20 text-center bg-bb-peach/50 border-b border-bb-border/30">
        <div className="container mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-[4px] text-bb-pink mb-3 block">HELP CENTER</span>
          <h1 className="font-heading text-4xl font-bold text-bb-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-base max-w-md mx-auto">Everything you need to know about Beauty Bees Cosmetics and K-Beauty.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-bb-border/30 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left bg-transparent border-none cursor-pointer text-bb-heading hover:text-bb-pink transition-colors"
                >
                  <span className="text-base font-semibold">{faq.q}</span>
                  {openIndex === index ? <Minus size={18} className="text-bb-pink" /> : <Plus size={18} className="text-slate-400" />}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
