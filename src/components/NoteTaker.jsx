import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Save, AlignLeft } from 'lucide-react';

export default function NoteTaker() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript((prev) => (prev + ' ' + text).trim());
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const saveNote = () => {
    if (!transcript.trim()) return;
    setNotes((prev) => [{ id: Date.now(), text: transcript.trim() }, ...prev]);
    setTranscript('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg flex items-center gap-2"><AlignLeft className="h-5 w-5"/>New note</h3>
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-emerald-500/90 text-white hover:bg-emerald-400 transition">
                <Mic className="h-4 w-4"/> Start mic
              </button>
            ) : (
              <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-red-500/90 text-white hover:bg-red-400 transition">
                <Square className="h-4 w-4"/> Stop
              </button>
            )}
            <button onClick={saveNote} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-white/10 hover:bg-white/10 transition">
              <Save className="h-4 w-4"/> Save note
            </button>
          </div>
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            recognitionRef.current ? 'Type here or use the mic to capture your lecture notes…' : 'Type here — your browser may not support speech recognition.'
          }
          className="mt-4 min-h-[200px] w-full rounded-xl bg-slate-900/60 border border-white/10 p-4 outline-none focus:ring-2 focus:ring-fuchsia-400/40"
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }} className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
        <h3 className="font-medium text-lg mb-3">Recent notes</h3>
        {notes.length === 0 ? (
          <p className="text-slate-400">No notes yet — use the mic or start typing to add your first note.</p>
        ) : (
          <ul className="space-y-3 max-h-[280px] overflow-auto pr-2">
            {notes.map((n) => (
              <li key={n.id} className="rounded-xl border border-white/10 p-3 bg-slate-900/50">
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{n.text}</p>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
