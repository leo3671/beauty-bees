"use client";

import { useState, useEffect } from 'react';
import styles from './support.module.css';
import { toast } from 'react-hot-toast';

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

  if (loading) return <div>Loading Support Hub...</div>;

  return (
    <div className={styles.container}>
      <aside className={styles.sessionList}>
        <h2>Live Chats</h2>
        {sessions.map(s => (
          <div 
            key={s.id} 
            className={`${styles.sessionItem} ${activeSession?.id === s.id ? styles.active : ''}`}
            onClick={() => setActiveSession(s)}
          >
            <div className={styles.sessionMeta}>
              <span>{s.id.slice(-6)}</span>
              <span className={styles.status}>{s.status === 'ai' ? '🤖 AI' : '👤 Admin'}</span>
            </div>
            <p className={styles.lastUpdate}>{new Date(s.updatedAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </aside>

      <main className={styles.chatArea}>
        {activeSession ? (
          <>
            <div className={styles.chatHeader}>
              <h3>Chat Session: {activeSession.id}</h3>
              {activeSession.status === 'ai' && (
                <button onClick={handleTakeOver} className={styles.takeOverBtn}>Take Over from AI</button>
              )}
            </div>
            <div className={styles.messages}>
              {messages.map((m, i) => (
                <div key={i} className={`${styles.message} ${styles[m.sender]}`}>
                  <span className={styles.senderLabel}>{m.sender.toUpperCase()}</span>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
            <form className={styles.replyArea} onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type your response..." 
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className={styles.placeholder}>Select a chat session to start monitoring.</div>
        )}
      </main>
    </div>
  );
}
