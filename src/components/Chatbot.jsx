import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your study copilot. Ask me to explain concepts, quiz you, or draft summaries.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, session_title: 'Quick Chat' })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'I ran into an issue reaching the AI service. Please add your GitHub token to the backend and try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="chat" className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-amber-200 mb-8">
          Chat with your AI tutor
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 min-h-[480px] flex flex-col">
            <div ref={listRef} className="flex-1 overflow-auto space-y-4 pr-1">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && <Bot className="h-5 w-5 mt-1 text-indigo-300" />}
                  <div className={`${m.role === 'user' ? 'bg-indigo-500/20 border-indigo-400/30' : 'bg-slate-900/60 border-white/10'} border rounded-xl px-3 py-2 max-w-[80%] whitespace-pre-wrap`}>{m.content}</div>
                  {m.role === 'user' && <User className="h-5 w-5 mt-1 text-amber-300" />}
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 mt-1 text-indigo-300" />
                  <div className="border border-white/10 rounded-xl px-3 py-2 bg-slate-900/60 text-slate-300 animate-pulse">Thinking…</div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="mt-4 flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your notes, topics, or assignments…"
                className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-400/40"
              />
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg px-4 py-3 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 text-slate-900 font-medium disabled:opacity-60">
                <Send className="h-4 w-4" /> Send
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }} className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
            <h3 className="font-medium text-lg mb-3">Tips</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Paste key points from a lecture and ask for a concise summary.</li>
              <li>Ask for step-by-step explanations of tricky problems.</li>
              <li>Request practice questions to test your understanding.</li>
              <li>Say "quiz me on this" followed by your notes.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
