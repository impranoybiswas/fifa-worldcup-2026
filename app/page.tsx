import WorldCupFixtures from "@/components/WorldCupFixtures";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      {/* Premium Header */}
      <div className="relative overflow-hidden pt-20 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-blue-500/10 blur-[120px] -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="live-indicator" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              Real-time Updates
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            World Cup <span className="gradient-text">2026</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Follow the journey of 48 nations across North America. Real-time
            fixtures, scores, and results in one place.
          </p>
        </div>
      </div>

      {/* Fixtures Section */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-500">
            Upcoming Fixtures
          </h2>
          <div className="h-px flex-1 mx-6 bg-white/5" />
        </div>

        <WorldCupFixtures />
      </div>

      {/* Simple Footer */}
      <footer className="mt-20 text-center text-slate-600 text-xs uppercase tracking-widest font-bold">
        FIFA World Cup 2026 · USA · CANADA · MEXICO
      </footer>
    </main>
  );
}
