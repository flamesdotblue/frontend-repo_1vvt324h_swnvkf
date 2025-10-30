import { motion } from 'framer-motion';
import { Rocket, Mic, FileText } from 'lucide-react';

export default function Navbar({ onGoNotes, onGoSummary }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute -inset-2 rounded-full bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/40 to-amber-500/40 blur"></span>
              <Rocket className="relative h-6 w-6 text-white" />
            </div>
            <span className="text-white font-semibold tracking-tight">AuraNote AI</span>
          </motion.div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={onGoNotes} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <Mic className="h-4 w-4" /> Notes
            </button>
            <button onClick={onGoSummary} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <FileText className="h-4 w-4" /> Summarize
            </button>
          </nav>
          <div className="flex md:hidden" />
        </div>
      </div>
    </header>
  );
}
