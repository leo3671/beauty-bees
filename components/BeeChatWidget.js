"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { cn } from '@/lib/utils';

export default function BeeChatWidget() {
  const [isOpen, setIsOpen]     = useState(false);
  const [message, setMessage]   = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const { language } = useLanguage();
  const [loading, setLoading]   = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

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
        setMessages(prev => [...prev, { sender: 'ai', content: data.error || "Bzzzt! Something went wrong." }]);
        return;
      }
      if (data.sessionId) setSessionId(data.sessionId);
      if (data.reply)     setMessages(prev => [...prev, { sender: 'ai', content: data.reply }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { sender: 'ai', content: "I'm having trouble connecting. Please try again. 🐝" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bee-chat-widget fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-3 transition-all duration-300">
      {isOpen ? (
        <div className="w-[340px] max-h-[480px] flex flex-col bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-bb-border/30 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-bb-pink to-bb-pink-hover">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐝</span>
              <div>
                <h4 className="text-white font-bold text-sm leading-none mb-0.5">Bee</h4>
                <p className="text-white/80 text-xs leading-none">K-Beauty Expert</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white text-2xl bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin">
            {messages.length === 0 && (
              <p className="text-sm text-bb-text/70 bg-bb-peach rounded-xl px-4 py-3 leading-relaxed">
                {language === 'en'
                  ? "Bzzzz! I'm Bee. How can I help you with your skincare routine today? 🌸"
                  : "बज्ज्ज्ज्! म बी हुँ। आज म तपाईंलाई कसरी मद्दत गर्न सक्छु? 🌸"}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  m.sender === 'user'
                    ? "self-end bg-bb-heading text-white rounded-br-md"
                    : "self-start bg-bb-peach text-bb-text rounded-bl-md"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-bb-peach text-bb-text/60 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md">
                Bee is thinking... 🐝
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-3 border-t border-bb-border/30"
          >
            <input
              type="text"
              placeholder="Ask Bee anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 text-sm border border-bb-border/50 rounded-xl px-3 py-2 outline-none bg-bb-bg
                focus:border-bb-pink focus:shadow-[0_0_0_2px_rgba(255,183,197,0.2)] transition-all"
            />
            <button
              type="submit"
              className="bg-bb-pink text-white text-sm font-semibold px-4 py-2 rounded-xl border-none cursor-pointer
                hover:bg-bb-pink-hover transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-bb-heading text-white px-5 py-3 rounded-full border-none cursor-pointer
            shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.25)] hover:-translate-y-0.5
            transition-all duration-200 font-semibold text-sm"
        >
          <span className="text-xl">🐝</span>
          <span>Ask Bee</span>
        </button>
      )}
    </div>
  );
}
