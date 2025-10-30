import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileUp, Scissors } from 'lucide-react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

// Use a CDN worker to avoid bundler config
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

function summarizeText(text, ratio = 0.25) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const words = clean.toLowerCase().match(/\b[a-zA-Z']+\b/g) || [];
  const stop = new Set(['the','is','in','at','of','a','to','and','for','on','with','as','by','an','be','are','this','that','it','from','or','we','you','your']);
  const freq = new Map();
  for (const w of words) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const maxFreq = Math.max(...Array.from(freq.values()), 1);
  // Normalize
  for (const [k,v] of freq) freq.set(k, v / maxFreq);

  const scores = sentences.map((s, idx) => {
    const sWords = (s.toLowerCase().match(/\b[a-zA-Z']+\b/g) || []);
    const score = sWords.reduce((acc, w) => acc + (freq.get(w) || 0), 0) / Math.max(sWords.length, 1);
    // Slight position bias for early sentences
    const positionBoost = 1 - (idx / sentences.length) * 0.15;
    return { s, score: score * positionBoost, idx };
  });
  const keep = Math.max(1, Math.round(sentences.length * ratio));
  const top = scores.sort((a,b) => b.score - a.score).slice(0, keep).sort((a,b) => a.idx - b.idx);
  return top.map(x => x.s.trim()).join(' ');
}

export default function Summarizer() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [ratio, setRatio] = useState(0.25);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const wordsCount = useMemo(() => (input.trim().split(/\s+/).filter(Boolean).length), [input]);

  async function handleFile(file) {
    if (!file) return;
    setLoading(true);
    setFileName(file.name);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += ' ' + content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
        }
        setInput(text.trim());
      } else if (file.type.startsWith('text/')) {
        const text = await file.text();
        setInput(text);
      } else {
        setInput('');
        alert('Please upload a PDF or text file.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to read file. Please try another document.');
    } finally {
      setLoading(false);
    }
  }

  function runSummary() {
    setLoading(true);
    setTimeout(() => {
      const s = summarizeText(input, ratio);
      setSummary(s || 'No content to summarize.');
      setLoading(false);
    }, 10);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg flex items-center gap-2"><FileUp className="h-5 w-5"/> Input</h3>
          <div className="text-xs text-slate-400">{wordsCount} words</div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input type="file" accept="application/pdf,text/plain,text/markdown,text/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" id="uploader" />
            <label htmlFor="uploader" className="cursor-pointer inline-flex items-center justify-center rounded-lg px-3 py-2 border border-white/10 hover:bg-white/10 transition">
              <FileUp className="h-4 w-4 mr-2"/> Upload PDF or text
            </label>
            {fileName && <span className="text-xs text-slate-400 truncate">{fileName}</span>}
          </label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste notes or extracted text here…" className="min-h-[220px] w-full rounded-xl bg-slate-900/60 border border-white/10 p-4 outline-none focus:ring-2 focus:ring-indigo-400/40" />

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">Compression</label>
            <input type="range" min={0.1} max={0.6} step={0.05} value={ratio} onChange={(e) => setRatio(parseFloat(e.target.value))} className="w-40" />
            <span className="text-xs text-slate-400">{Math.round(ratio * 100)}%</span>
          </div>

          <button disabled={loading} onClick={runSummary} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-amber-300 text-slate-900 font-medium disabled:opacity-60">
            <Sparkles className="h-4 w-4"/> {loading ? 'Summarizing…' : 'Quick summarize'}
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }} className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
        <h3 className="font-medium text-lg flex items-center gap-2"><Scissors className="h-5 w-5"/> Summary</h3>
        <div className="mt-4 min-h-[220px] rounded-xl bg-slate-900/60 border border-white/10 p-4 whitespace-pre-wrap">
          {summary ? (
            <p className="leading-relaxed text-slate-100">{summary}</p>
          ) : (
            <p className="text-slate-400">Your summary will appear here. Upload a PDF or paste your notes, then click Quick summarize.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
