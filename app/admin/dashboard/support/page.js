"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function AdminSupportHub() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id);
      const interval = setInterval(() => fetchMessages(activeSession.id), 3000);
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat/sessions');
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sid) => {
    try {
      const res = await fetch(`/api/admin/chat/messages?sessionId=${sid}`);
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTakeOver = async () => {
    try {
      const res = await fetch('/api/admin/chat/takeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSession.id })
      });
      if (res.ok) {
        toast.success('AI paused. You are now chatting!');
        setActiveSession({...activeSession, status: 'admin'});
      }
    } catch (e) {
      toast.error('Takeover failed');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const res = await fetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSession.id, content: reply })
      });
      if (res.ok) {
        setReply('');
        fetchMessages(activeSession.id);
      }
    } catch (e) {
      toast.error('Send failed');
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading Support Hub...</div>;

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <aside className="w-80 border-r border-slate-200 flex flex-col p-4 overflow-y-auto flex-shrink-0">
        <h2 className="font-heading text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">Live Chats</h2>
        <div className="flex flex-col gap-2">
          {sessions.map(s => (
            <div 
              key={s.id} 
              className={cn(
                "p-3.5 rounded-xl cursor-pointer hover:bg-slate-50 transition-all border flex flex-col gap-1.5",
                activeSession?.id === s.id 
                  ? "bg-bb-peach/50 border-bb-pink/30 shadow-sm" 
                  : "bg-white border-slate-100"
              )}
              onClick={() => setActiveSession(s)}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">ID: {s.id.slice(-6)}</span>
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                  s.status === 'ai' ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"
                )}>
                  {s.status === 'ai' ? '🤖 AI' : '👤 Admin'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{new Date(s.updatedAt).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
        {activeSession ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center flex-shrink-0">
              <h3 className="font-heading text-sm font-bold text-bb-heading truncate max-w-[200px] md:max-w-xs">Chat Session: {activeSession.id}</h3>
              {activeSession.status === 'ai' && (
                <button onClick={handleTakeOver} className="bg-bb-pink hover:bg-bb-pink-hover text-white text-xs font-bold px-3 py-1.5 rounded-xl border-none cursor-pointer transition-colors shadow-sm">
                  Take Over
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col max-w-[70%]",
                    m.sender === 'admin' ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <span className="text-[9px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">{m.sender}</span>
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                    m.sender === 'admin' && "bg-bb-pink text-white rounded-tr-none",
                    m.sender === 'ai' && "bg-purple-50 text-purple-800 border border-purple-100 rounded-tl-none",
                    m.sender === 'user' && "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <form className="p-4 bg-white border-t border-slate-200 flex gap-2 flex-shrink-0" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type your response..." 
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="flex-1 bg-bb-bg border border-bb-border/60 rounded-xl px-4 py-3 text-sm text-bb-text outline-none focus:border-bb-pink transition-all"
              />
              <button type="submit" className="bg-bb-heading hover:bg-bb-text text-white text-sm font-bold px-5 py-3 rounded-xl border-none cursor-pointer transition-colors shadow-sm flex-shrink-0">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium text-sm">Select a chat session to start monitoring.</div>
        )}
      </main>
    </div>
  );
}
