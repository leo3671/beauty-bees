import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import styles from '../page.module.css';

export default function Contact() {
  return (
    <div className={styles.page}>
      <section style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(135deg, #fdf2f8 0%, #fff 100%)' }}>
        <div className="container">
          <span className={styles.sectionTag}>GET IN TOUCH</span>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>We're Here to Help</h1>
          <p style={{ color: '#6b5b5e', fontSize: '1.1rem' }}>Have a question about a product or your order? Reach out to our skincare experts.</p>
        </div>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          <div style={{ padding: '30px', borderRadius: '16px', background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#fdf2f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#be185d' }}>
              <Mail size={24} />
            </div>
            <h3 style={{ marginBottom: '10px' }}>Email Us</h3>
            <p style={{ color: '#8a7b7e' }}>beautybeesnp@gmail.com</p>
          </div>

          <div style={{ padding: '30px', borderRadius: '16px', background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#fdf2f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#be185d' }}>
              <Phone size={24} />
            </div>
            <h3 style={{ marginBottom: '10px' }}>Call Us</h3>
            <p style={{ color: '#8a7b7e' }}>9867772341</p>
          </div>

          <div style={{ padding: '30px', borderRadius: '16px', background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: '#fdf2f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#be185d' }}>
              <MessageSquare size={24} />
            </div>
            <h3 style={{ marginBottom: '10px' }}>WhatsApp</h3>
            <a 
              href="https://wa.me/9779867772341" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#be185d', fontWeight: '600', textDecoration: 'none' }}
            >
              Direct Message
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 20px', background: '#fafafa' }}>
        <div className="container">
          <div style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.748366970732!2d85.3400599!3d27.6915196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199859f7b0f7%3A0x6b4f7a77f98c47b!2sNew%20Baneshwor%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1715000000000!5m2!1sen!2snp" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Send us a Message</h2>
            <form style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input type="text" placeholder="Full Name" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', outline: 'none' }} />
                <input type="email" placeholder="Email Address" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', outline: 'none' }} />
              </div>
              <input type="text" placeholder="Subject" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', outline: 'none' }} />
              <textarea placeholder="How can we help you?" rows="5" style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', outline: 'none', resize: 'none' }}></textarea>
              <button type="submit" className={styles.ctaPrimary} style={{ width: '100%', border: 'none', cursor: 'pointer' }}>Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
