"use client";

import { teamInBangla } from "@/lib/team-bangla";
import { banglaDate, banglaTime } from "@/lib/bangla-date";
import { Match } from "@/types/match";
import Image from "next/image";
import { Calendar, Clock, Trophy, Users, UserCheck } from "lucide-react";

export default function MatchCard({ match }: { match: Match }) {
  // Safety check — bail early if match data is missing
  if (!match || (!match.homeTeam?.name && !match.awayTeam?.name)) return null;

  const { homeTeam, awayTeam, status, utcDate, stage, group, score, referees } =
    match;

  // Match state flags
  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";
  const isScheduled = status === "TIMED" || status === "SCHEDULED";

  // Safe score extraction
  const homeScore = score?.fullTime?.home ?? 0;
  const awayScore = score?.fullTime?.away ?? 0;

  // Winner logic — only meaningful after full time
  const homeWins = isFinished && homeScore > awayScore;
  const awayWins = isFinished && awayScore > homeScore;

  // Human-readable status label
  const statusLabel = isLive
    ? status === "PAUSED"
      ? "Half time"
      : "Live"
    : isFinished
      ? "Full time"
      : "Upcoming";

  // Formatted stage string — e.g. "GROUP_STAGE" → "Group stage"
  const stageLabel = stage
    ? stage
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
    : "World Cup";

  return (
    <div
      data-aos="fade-up"
      className="group relative w-full max-w-[400px] mx-auto bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-500/20 transition-all duration-500"
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-white/2 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {stageLabel} {group && `· ${group.replace(/_/g, " ")}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3 h-3" />
            <span className="text-[10px] font-medium tabular-nums">
              {banglaDate(utcDate)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-medium tabular-nums">
              {banglaTime(utcDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Scoreboard Area */}
      <div className="px-6 py-6 flex items-center justify-between gap-4">
        {/* Home Team */}
        <TeamDisplay
          team={homeTeam}
          isWinner={homeWins}
          isLoser={isFinished && !homeWins}
        />

        {/* Score / Status */}
        <div className="flex flex-col items-center justify-center min-w-[80px]">
          {isScheduled ? (
            <div className="text-2xl font-black text-slate-100 dark:text-white/5 tracking-tighter select-none">
              VS
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={`text-4xl font-black tracking-tighter tabular-nums ${homeWins ? "text-emerald-500" : "text-slate-800 dark:text-slate-100"}`}
              >
                {homeScore}
              </span>
              <span className="text-xl font-light text-slate-200">:</span>
              <span
                className={`text-4xl font-black tracking-tighter tabular-nums ${awayWins ? "text-emerald-500" : "text-slate-800 dark:text-slate-100"}`}
              >
                {awayScore}
              </span>
            </div>
          )}
          <StatusBadge
            label={statusLabel}
            isLive={isLive}
            isScheduled={isScheduled}
          />
        </div>

        {/* Away Team */}
        <TeamDisplay
          team={awayTeam}
          isWinner={awayWins}
          isLoser={isFinished && !awayWins}
        />
      </div>

      {/* Referee Footer */}
      {referees && referees.length > 0 && (
        <div className="px-4 py-2 bg-slate-50/30 dark:bg-white/1 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2">
          <UserCheck className="w-3 h-3 text-slate-300" />
          <span className="text-[9px] font-medium text-slate-400">
            Match Referee:{" "}
          </span>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-300">
            {referees[0].name}{" "}
            {referees[0].nationality && `(${referees[0].nationality})`}
          </span>
        </div>
      )}
    </div>
  );
}

function TeamDisplay({
  team,
  isWinner,
  isLoser,
}: {
  team: Match["homeTeam"];
  isWinner: boolean;
  isLoser: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 flex-1 min-w-0 ${isLoser ? "opacity-40" : "opacity-100"} transition-all duration-300`}
    >
      <div className="relative w-14 h-9 overflow-hidden rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 grid place-items-center group-hover:scale-105 transition-transform">
        {team.crest ? (
          <Image
            src={team.crest}
            alt={team.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <span className="text-[10px] font-black text-slate-300 uppercase">
            {team.tla || "?"}
          </span>
        )}
      </div>
      <span
        className={`text-[11px] font-bold truncate w-full text-center tracking-tight ${isWinner ? "text-emerald-500" : "text-slate-700 dark:text-slate-200"}`}
      >
        {teamInBangla(team.name)}
      </span>
      {isWinner && (
        <div className="hidden items-center gap-1 text-[8px] font-black uppercase text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
          <Users className="w-2 h-2" />
          Winner
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  label,
  isLive,
  isScheduled,
}: {
  label: string;
  isLive: boolean;
  isScheduled: boolean;
}) {
  return (
    <div
      className={`mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${
        isLive
          ? "bg-red-50 text-red-500 border-red-100 animate-pulse"
          : isScheduled
            ? "bg-blue-50 text-blue-500 border-blue-100"
            : "bg-slate-50 text-slate-400 border-slate-100"
      }`}
    >
      {isLive && <span className="w-1 h-1 rounded-full bg-red-500" />}
      {label}
    </div>
  );
}
