import { useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import NoteTaker from './components/NoteTaker.jsx';
import Summarizer from './components/Summarizer.jsx';

export default function App() {
  const notesRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    // Ensure smooth scrolling across the app
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Navbar onGoNotes={() => notesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              onGoSummary={() => summaryRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      <Hero onGetStarted={() => notesRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      <section ref={notesRef} id="notes" className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-200 mb-8">
            Capture notes by voice or typing
          </h2>
          <NoteTaker />
        </div>
      </section>

      <section ref={summaryRef} id="summary" className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-fuchsia-300 to-indigo-300 mb-8">
            Advanced summarization for notes and PDFs
          </h2>
          <Summarizer />
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AuraNote AI — Learn faster with an AI voice agent.</p>
          <div className="flex items-center gap-3">
            <a href="#notes" className="hover:text-white">Notes</a>
            <span className="opacity-40">·</span>
            <a href="#summary" className="hover:text-white">Summarize</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
