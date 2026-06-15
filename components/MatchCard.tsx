"use client";

import { teamInBangla } from "@/lib/team-bangla";
import { banglaDate, banglaTime } from "@/lib/bangla-date";
import { Match } from "@/types/match";
import Image from "next/image";

export default function MatchCard({ match }: { match: Match }) {
  // Safety check — bail early if match data is missing
  if (!match || (!match.homeTeam?.name && !match.awayTeam?.name)) return null;

  const { homeTeam, awayTeam, status, utcDate, stage, group, score, referees } = match;

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
    ? stage.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    : "World Cup";

  return (
    <div className="w-full max-w-sm mx-auto bg-white border border-black/6 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* ── Top meta row: stage / group · date & time · status badge ── */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-black/5">
        {/* Stage & group */}
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 truncate">
          {stageLabel}
          {group && ` · ${group.replace(/_/g, " ")}`}
        </span>

        {/* Date · time */}
        <span className="text-[10px] text-slate-400 whitespace-nowrap tabular-nums shrink-0">
          {banglaDate(utcDate)} · {banglaTime(utcDate)}
        </span>
      </div>

      {/* ── Scoreboard: home | score/vs | away ── */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4">

        {/* Home team */}
        <TeamColumn
          team={homeTeam}
          isWinner={homeWins}
          isLoser={isFinished && !homeWins}
          isLive={isLive}
        />

        {/* Center: score or VS + status */}
        <div className="flex flex-col items-center gap-1.5">
          {isScheduled ? (
            <span className="text-xl font-semibold text-slate-200 tracking-wider">VS</span>
          ) : (
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className={`text-3xl font-semibold leading-none ${homeWins ? "text-emerald-600" : "text-slate-800"}`}>
                {homeScore}
              </span>
              <span className="text-lg text-slate-200 font-light">:</span>
              <span className={`text-3xl font-semibold leading-none ${awayWins ? "text-emerald-600" : "text-slate-800"}`}>
                {awayScore}
              </span>
            </div>
          )}

          {/* Status badge */}
          <StatusBadge label={statusLabel} isLive={isLive} isScheduled={isScheduled} />
        </div>

        {/* Away team */}
        <TeamColumn
          team={awayTeam}
          isWinner={awayWins}
          isLoser={isFinished && !awayWins}
          isLive={isLive}
        />
      </div>

      {/* ── Footer: referee info (optional) ── */}
      {referees && referees.length > 0 && (
        <div className="flex items-center justify-center gap-1 px-4 py-2 border-t border-black/5 text-[10px] text-slate-400">
          <span>Ref:</span>
          <span className="text-slate-500 font-medium">{referees[0].name}</span>
          {referees[0].nationality && (
            <span className="text-slate-300">({referees[0].nationality})</span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Team column: flag + name + optional winner badge ──────────────────────────
function TeamColumn({
  team,
  isWinner,
  isLoser,
  isLive,
}: {
  team: Match["homeTeam"] | Match["awayTeam"];
  isWinner: boolean;
  isLoser: boolean;
  isLive: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${isLoser ? "opacity-35" : "opacity-100"}`}>
      {/* Flag / crest */}
      <div className="w-14 h-9 rounded-lg border border-black/6 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
        {team.crest ? (
          <Image
            src={team.crest}
            alt={team.name}
            width={56}
            height={36}
            className="object-cover w-full h-full"
            priority={isLive}
          />
        ) : (
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {team.tla || "?"}
          </span>
        )}
      </div>

      {/* Team name */}
      <p className={`text-[11px] font-semibold text-center leading-tight px-1 truncate w-full ${isWinner ? "text-emerald-600" : "text-slate-700"}`}>
        {teamInBangla(team.name)}
      </p>

      {/* Winner badge — only shown for the winning side */}
      {isWinner && (
        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
          Winner
        </span>
      )}
    </div>
  );
}

// ── Status badge with live pulse animation ────────────────────────────────────
function StatusBadge({
  label,
  isLive,
  isScheduled,
}: {
  label: string;
  isLive: boolean;
  isScheduled: boolean;
}) {
  const base = "inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border";

  const variant = isLive
    ? `${base} bg-red-50 text-red-600 border-red-200`
    : isScheduled
      ? `${base} bg-blue-50 text-blue-500 border-blue-200`
      : `${base} bg-slate-50 text-slate-400 border-slate-200`;

  return (
    <span className={variant}>
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      {label}
    </span>
  );
}