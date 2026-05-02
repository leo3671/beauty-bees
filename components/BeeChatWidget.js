"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import styles from './BeeChatWidget.module.css';

export default function BeeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { sender: 'user', content: message };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId, language })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          content: data.error || "Bzzzt! Something went wrong. Please try again." 
        }]);
        return;
      }

      if (data.sessionId) setSessionId(data.sessionId);
      if (data.reply) {
        setMessages(prev => [...prev, { sender: 'ai', content: data.reply }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        content: "I'm having trouble connecting right now. Please check your internet or try again later. 🐝" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen ? (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.beeInfo}>
              <span className={styles.beeIcon}>🐝</span>
              <div>
                <h4>Bee</h4>
                <p>K-Beauty Expert</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>&times;</button>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 && (
              <p className={styles.welcome}>
                {language === 'en' 
                  ? "Bzzzz! I'm Bee. How can I help you with your skincare routine today? 🌸" 
                  : "बज्ज्ज्ज्! म बी हुँ। आज म तपाईंलाई तपाईंको छालाको हेरचाहमा कसरी मद्दत गर्न सक्छु? 🌸"}
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`${styles.message} ${styles[m.sender]}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className={styles.loading}>Bee is thinking... 🐝</div>}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.inputArea} onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask Bee anything..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className={styles.launcher} onClick={() => setIsOpen(true)}>
          <span className={styles.beeIcon}>🐝</span>
          <span className={styles.label}>Ask Bee</span>
        </button>
      )}
    </div>
  );
}
