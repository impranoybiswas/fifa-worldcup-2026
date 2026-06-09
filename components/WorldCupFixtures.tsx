"use client";

import useSWR from "swr";
import { Match } from "@/types/match";
import Image from "next/image";
import { formatBanglaDateTime } from "@/lib/banglaTime";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WorldCupFixtures() {
  const {
    data: matches,
    error,
    isLoading,
  } = useSWR<Match[]>("/api/worldcup", fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">
          Syncing Fixtures...
        </p>
      </div>
    );
  }

  if (error || !matches || !Array.isArray(matches) || matches.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
          No matches found
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {matches.map((match) => {
        const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
        const isFinished = match.status === "FINISHED";

        return (
          <div key={match.id} className="glass-card group p-6 md:p-8">
            {/* Top Bar: Date & Status */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {formatBanglaDateTime(match.utcDate)}
                </span>
              </div>
              <div
                className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  isLive
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    : isFinished
                      ? "bg-slate-500/10 border-white/5 text-slate-500"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}
              >
                {isLive && <span className="live-indicator" />}
                {match.status.replace("_", " ")}
              </div>
            </div>

            {/* Match Teams & Score */}
            <div className="flex items-center justify-between gap-4 md:gap-8">
              {/* Home Team */}
              <div className="flex flex-1 flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 transition-transform group-hover:scale-110">
                  <Image
                    src={
                      match.homeTeam.crest ||
                      "https://crests.football-data.org/9396.svg"
                    }
                    alt={match.homeTeam.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <span className="text-sm md:text-lg font-black uppercase tracking-tight text-white line-clamp-1">
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score Board */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-6 py-4 border border-white/10 shadow-inner">
                  <span
                    className={`text-4xl md:text-5xl font-black tabular-nums transition-all ${match.score.fullTime.home !== null ? "text-white" : "text-slate-700"}`}
                  >
                    {match.score.fullTime.home ?? 0}
                  </span>
                  <span className="text-xl font-bold text-slate-600">:</span>
                  <span
                    className={`text-4xl md:text-5xl font-black tabular-nums transition-all ${match.score.fullTime.away !== null ? "text-white" : "text-slate-700"}`}
                  >
                    {match.score.fullTime.away ?? 0}
                  </span>
                </div>
                {isFinished && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                    Final Score
                  </span>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-1 flex-col-reverse md:flex-row items-center gap-4 text-center md:text-right">
                <span className="text-sm md:text-lg font-black uppercase tracking-tight text-white line-clamp-1">
                  {match.awayTeam.name}
                </span>
                <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 transition-transform group-hover:scale-110">
                  <Image
                    src={
                      match.awayTeam.crest ||
                      "https://crests.football-data.org/9396.svg"
                    }
                    alt={match.awayTeam.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
