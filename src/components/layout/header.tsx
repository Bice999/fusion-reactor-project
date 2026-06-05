import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-mono text-xl font-bold tracking-tighter text-white uppercase italic">
              Fusion<span className="text-cyan-400">Core</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
            <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Grid Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}