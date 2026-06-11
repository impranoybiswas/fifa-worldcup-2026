"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import useSWR from "swr";
import { Match } from "@/types/match";
import MatchCard from "./MatchCard";
import { teamInBangla } from "@/lib/team-bangla";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorldCupFixtures() {
  const scrollKey = "worldcup_scroll_pos";
  const [selectedTeam, setSelectedTeam] = useState<string>("all");

  // পারফরম্যান্স অপ্টিমাইজেশনের জন্য useRef ব্যবহার করা হয়েছে (কোনো অপ্রয়োজনীয় রি-রেন্ডার হবে না)
  const scrollPosRef = useRef<number>(0);

  // ১. স্ক্রোল পজিশন লোকালস্টোরেজে ট্র্যাক করা (Debounce বা রি-রেন্ডার ছাড়া ফাস্ট ট্র্যাকিং)
  useEffect(() => {
    // মাউন্ট হওয়ার সময় আগের স্ক্রোল রি-স্টোর করা
    const savedPos = localStorage.getItem(scrollKey);
    if (savedPos) {
      scrollPosRef.current = parseInt(savedPos, 10);

      // মোবাইলের স্লো রেন্ডারিং ব্যাকআপের জন্য একাধিক ট্রাই করা (পোলিং ট্রিক)
      const tryScroll = (attempts = 0) => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "instant" });

        // যদি স্ক্রোল পজিশন সফলভাবে সেট না হয় এবং ৩ বারের কম ট্রাই করা হয়ে থাকে
        if (window.scrollY < scrollPosRef.current && attempts < 3) {
          setTimeout(() => tryScroll(attempts + 1), 150);
        }
      };

      // প্রথম রান
      setTimeout(() => tryScroll(), 250); // ২৫০ মিলিমেকেন্ড সেফ ডিলে
    }

    const handleScroll = () => {
      scrollPosRef.current = window.scrollY;
      localStorage.setItem(scrollKey, window.scrollY.toString());
    };

    // মোবাইলের টাচ স্ক্রোলের জন্য touchmove ও যোগ করে দেওয়া সেফ
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ২. SWR দিয়ে লাইভ ডেটা ফেচিং
  const {
    data: matches,
    error,
    isLoading,
  } = useSWR<Match[]>("/api/worldcup", fetcher, {
    refreshInterval: 5000, // প্রতি ৫ সেকেন্ডে লাইভ স্কোর আপডেট হবে
    revalidateOnFocus: true,
    // ডেটা আপডেট হওয়ার সাথে সাথে স্ক্রোল পজিশন লক রাখবে
    onSuccess: () => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollPosRef.current, behavior: "instant" });
      });
    },
  });

  // অনন্য টিমের তালিকা বের করা
  const teams = useMemo(() => {
    if (!matches) return [];
    const teamSet = new Set<string>();
    matches.forEach((m: Match) => {
      if (m.homeTeam.name) teamSet.add(m.homeTeam.name);
      if (m.awayTeam.name) teamSet.add(m.awayTeam.name);
    });
    return Array.from(teamSet).sort((a, b) => a.localeCompare(b));
  }, [matches]);

  // ফিল্টার করা ম্যাচের তালিকা
  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    if (selectedTeam === "all") return matches;
    return matches.filter(
      (m: Match) =>
        m.homeTeam.name === selectedTeam || m.awayTeam.name === selectedTeam,
    );
  }, [matches, selectedTeam]);

  // মডার্ন গ্লাস-মর্ফিজম স্কেলিটন লোডার
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/20 opacity-75" />
          <div className="h-12 w-12 rounded-full border-[3px] border-white/5 border-t-blue-500 animate-spin" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-foreground/60 animate-pulse">
            Syncing Fixtures
          </p>
          <p className="text-[10px] text-foreground/40">
            লাইভ ম্যাচ আপডেট হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ক্লিন এরর স্টেট
  if (error || !matches || !Array.isArray(matches) || matches.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/2 p-16 text-center backdrop-blur-md">
        <div className="absolute -inset-px bg-linear-to-r from-red-500/10 to-transparent opacity-10 blur-xl" />
        <p className="relative z-10 text-foreground/50 font-bold uppercase tracking-widest text-xs">
          কোনো ম্যাচ পাওয়া যায়নি বা সার্ভার ত্রুটি
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Team Filter Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold tracking-tight">
            সব ম্যাচের সময়সূচী
          </h2>
          <p className="text-xs text-foreground/50">
            বিশ্বকাপ ২০২৬ এর সর্বশেষ আপডেট
          </p>
        </div>

        <div className="relative group w-full md:w-auto">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full md:w-auto
              appearance-none cursor-pointer
              bg-white dark:bg-zinc-900 
              border border-black/5 dark:border-white/10
              rounded-2xl px-5 py-3 pr-12
              text-sm font-bold shadow-sm
              transition-all duration-300
              hover:shadow-lg hover:border-primary/30
              focus:ring-2 focus:ring-primary/20 focus:outline-none
            "
          >
            <option value="all">সব দল (All Teams)</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {teamInBangla(team)} ({team})
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="py-20 text-center opacity-50 font-bold text-sm">
          এই দলের কোনো ম্যাচ পাওয়া যায়নি
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
