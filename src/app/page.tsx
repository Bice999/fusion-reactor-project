import { ReactorPlayground } from '@/components/fusion/reactor-playground';
import { FusionAdvisor } from '@/components/fusion/fusion-advisor';
import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Header />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-mono uppercase italic">
              Plasma Control & Fusion Simulation
            </h1>
            <p className="text-slate-400 font-mono text-sm mt-1">
              Experimental Reactor Control Interface v4.5.0-AI_ENHANCED
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <div className="size-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">AI Advisor Online</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ReactorPlayground />
          </div>
          <div className="lg:col-span-4">
            <FusionAdvisor />
          </div>
        </div>
      </main>
    </div>
  );
}
