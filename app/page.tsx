import WorldCupFixtures from "@/components/WorldCupFixtures";
import { Radio } from "lucide-react";

export default function Home() {
  return (
    <main className="pb-24 min-h-dvh bg-linear-to-b from-slate-100 via-zinc-200 to-zinc-300 overflow-x-hidden">
      {/* প্রিমিয়াম হেডার সেকশন */}
      <div className="relative overflow-hidden pt-24 pb-20 px-4 md:px-6">
        {/* ব্যাকগ্রাউন্ড গ্লো ইফেক্ট (Ambient Glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-linear-to-b from-blue-600/15 to-transparent blur-[140px] -z-10" />
        <div className="absolute top-12 left-1/4 w-32 h-32 bg-emerald-500/10 blur-[80px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          {/* লাইভ ব্যাজ */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] mb-8"
            data-aos="zoom-in"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-300">
              রিয়েল-টাইম আপডেট
            </span>
          </div>

          {/* প্রধান শিরোনাম */}
          <h1
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.15]"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            বর্ণ’স ফিফা <br /> বিশ্বকাপ ফিক্সচার
            <br />
            <span className="block mt-2 bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm text-6xl md:text-8xl">
              ২০২৬
            </span>
          </h1>

          {/* সাবটাইটেল */}
          <p
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            উত্তর আমেরিকার মাটিতেল লড়াইয়ে নামছে ৪৮টি দল। বিশ্বসেরা হওয়ার এই
            মহাযজ্ঞের সব ফিক্সচার, লাইভ স্কোর এবং ফলাফল এখন এক জায়গায়।
          </p>
        </div>
      </div>

      {/* ফিক্সচার সেকশন */}
      <div
        className="max-w-5xl mx-auto px-4 md:px-6"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <WorldCupFixtures />
      </div>

      {/* প্রিমিয়াম ফুটার */}
      <footer
        className="mt-24  text-center text-slate-500 text-xs font-bold tracking-widest uppercase px-4"
        data-aos="fade-up"
      >
        <span className="text-blue-500 text-2xl">ফিফা বিশ্বকাপ ২০২৬</span>
        <br />
        ইউএসএ <span className="text-slate-700 mx-1.5">•</span> কানাডা
        <span className="text-slate-700 mx-1.5">•</span> মেক্সিকো
      </footer>
    </main>
  );
}
