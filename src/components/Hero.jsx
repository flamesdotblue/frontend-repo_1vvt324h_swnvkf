import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/80" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
            Learn faster with an AI voice agent for notes and summaries
          </h1>
          <p className="mt-4 text-slate-300 text-lg">
            Capture ideas by speaking or typing. Get advanced, quick summaries of lectures, notes, and PDFs with smooth, delightful animations.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={onGetStarted} className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium text-slate-900 bg-gradient-to-r from-amber-300 via-fuchsia-300 to-indigo-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
              Get started
            </button>
            <a href="#summary" className="rounded-xl px-6 py-3 border border-white/10 text-slate-200 hover:bg-white/5 transition-colors">
              Summarize a PDF
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
