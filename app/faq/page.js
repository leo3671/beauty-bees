"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import styles from '../page.module.css';

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
    <div className={styles.page}>
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-color)' }}>
        <div className="container">
          <span className={styles.sectionTag}>HELP CENTER</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Frequently Asked Questions</h1>
          <p style={{ color: '#6b5b5e' }}>Everything you need to know about Beauty Bees Cosmetics and K-Beauty.</p>
        </div>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                style={{ 
                  background: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid #eee',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  style={{
                    width: '100%',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-color)' }}>{faq.q}</span>
                  {openIndex === index ? <Minus size={20} color="#be185d" /> : <Plus size={20} color="#8a7b7e" />}
                </button>
                {openIndex === index && (
                  <div style={{ padding: '0 24px 24px', color: '#6b5b5e', lineHeight: '1.7', fontSize: '1rem' }}>
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
