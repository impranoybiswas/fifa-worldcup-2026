"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import useSWR from "swr";
import { Match } from "@/types/match";
import MatchCard from "./MatchCard";
import { teamInBangla } from "@/lib/team-bangla";
import { Search, Loader2, Info, ArrowDownIcon } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const SCROLL_KEY = "worldcup_scroll_pos";

// mobile-safe scroll restore: target height-এ না পৌঁছানো পর্যন্ত retry করে
function restoreScroll(targetY: number, maxAttempts = 12) {
  let attempts = 0;

  const tryScroll = () => {
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const maxScrollable = pageHeight - viewportHeight;

    if (maxScrollable >= targetY || attempts >= maxAttempts) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      return;
    }

    attempts++;
    // exponential backoff: 100ms, 150ms, 200ms...
    setTimeout(tryScroll, 100 + attempts * 50);
  };

  // প্রথম try একটু দেরিতে — DOM paint শেষ হওয়ার পর
  requestAnimationFrame(() => setTimeout(tryScroll, 80));
}

export default function WorldCupFixtures() {
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const scrollPosRef = useRef<number>(0);
  const hasRestoredRef = useRef(false); // একবারের বেশি restore না করতে

  // mount-এ scroll position সেভ করা আছে কিনা দেখো
  useEffect(() => {
    const savedPos = localStorage.getItem(SCROLL_KEY);
    if (savedPos) {
      scrollPosRef.current = parseInt(savedPos, 10);
    }

    const handleScroll = () => {
      scrollPosRef.current = window.scrollY;
      localStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    data: matches,
    error,
    isLoading,
  } = useSWR<Match[]>("/api/worldcup", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    onSuccess: () => {
      // ডেটা আসার পর scroll restore করো — শুধু প্রথমবার
      if (!hasRestoredRef.current && scrollPosRef.current > 0) {
        hasRestoredRef.current = true;
        restoreScroll(scrollPosRef.current);
      } else if (hasRestoredRef.current) {
        // পরের refresh-এ শুধু position lock রাখো
        requestAnimationFrame(() => {
          window.scrollTo({ top: scrollPosRef.current, behavior: "instant" });
        });
      }
    },
  });

  const teams = useMemo(() => {
    if (!matches) return [];
    const teamSet = new Set<string>();
    matches.forEach((m: Match) => {
      if (m.homeTeam.name) teamSet.add(m.homeTeam.name);
      if (m.awayTeam.name) teamSet.add(m.awayTeam.name);
    });
    return Array.from(teamSet).sort((a, b) => a.localeCompare(b));
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    if (selectedTeam === "all") return matches;
    return matches.filter(
      (m: Match) =>
        m.homeTeam.name === selectedTeam || m.awayTeam.name === selectedTeam,
    );
  }, [matches, selectedTeam]);

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32 gap-6"
        data-aos="zoom-in"
      >
        <div className="relative flex h-16 w-16 items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-foreground/60">
            Syncing Fixtures
          </p>
          <p className="text-[10px] text-foreground/40">
            লাইভ ম্যাচ আপডেট হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (error || !matches || !Array.isArray(matches) || matches.length === 0) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-16 text-center backdrop-blur-md"
        data-aos="fade-up"
      >
        <Info className="w-8 h-8 text-slate-400 mx-auto mb-4 opacity-50" />
        <p className="relative z-10 text-foreground/50 font-bold uppercase tracking-widest text-xs">
          কোনো ম্যাচ পাওয়া যায়নি বা সার্ভার ত্রুটি
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex flex-col" data-aos="fade-right">
          <h2 className="text-xl font-bold tracking-tight">
            সব ম্যাচের সময়সূচী
          </h2>
          <p className="text-xs text-foreground/50">
            বিশ্বকাপ ২০২৬ এর সর্বশেষ আপডেট
          </p>
        </div>

        <div className="relative group w-full md:w-auto" data-aos="fade-left">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
            <Search className="w-4 h-4" />
          </div>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full md:w-80 appearance-none cursor-pointer
              bg-white dark:bg-zinc-900/50
              border border-slate-100 dark:border-white/5
              rounded-2xl pl-12 pr-12 py-3
              text-sm font-bold shadow-sm
              transition-all duration-300
              hover:shadow-md hover:border-blue-500/30
              focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
          >
            <option value="all">ফিল্টার করুন (All Teams)</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {teamInBangla(team)} ({team})
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity">
           <ArrowDownIcon className="w-4 h-4"/>
          </div>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="py-20 text-center opacity-50 font-bold text-sm">
          এই দলের কোনো ম্যাচ পাওয়া যায়নি
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
          {filteredMatches.map((match: Match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
