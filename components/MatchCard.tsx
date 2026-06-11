"use client";

import { teamInBangla } from "@/lib/team-bangla";
import { banglaDate, banglaTime } from "@/lib/bangla-date";
import { Match } from "@/types/match";
import Image from "next/image";

export default function MatchCard({ match }: { match: Match }) {
  const { homeTeam, awayTeam, status, utcDate, stage, group, score } = match;

  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";
  const isScheduled = status === "TIMED" || status === "SCHEDULED";

  const homeScore = score?.fullTime?.home ?? 0;
  const awayScore = score?.fullTime?.away ?? 0;

  const homeWins = isFinished && homeScore > awayScore;
  const awayWins = isFinished && awayScore > homeScore;

  const statusLabel = isLive
    ? status === "PAUSED"
      ? "মধ্য বিরতি"
      : "লাইভ"
    : isFinished
      ? "শেষ"
      : "শুরু হবে";

  if (!homeTeam?.name && !awayTeam?.name) return null;

  return (
    <div
      className="
      group overflow-hidden rounded-3xl
      border border-black/5 dark:border-white/10
      bg-white dark:bg-zinc-900
      shadow-sm transition-all duration-300
      hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* Accent Line */}
      <div
        className={`h-1 w-full ${
          isLive
            ? "bg-linear-to-r from-red-500 to-orange-500"
            : isScheduled
              ? "bg-linear-to-r from-blue-500 to-indigo-500"
              : "bg-linear-to-r from-emerald-500 to-green-500"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <span
              className="
              inline-flex items-center rounded-full
              bg-primary/10 px-3 py-1
              text-[10px] font-bold uppercase
              tracking-widest text-primary
              "
            >
              {stage?.replace(/_/g, " ") || "WORLD CUP"}
            </span>

            {group && (
              <p className="inline-flex items-center rounded-full
              bg-primary/10 px-3 py-1
              text-[10px] font-bold uppercase
              tracking-widest text-primary ml-2">
                {group.replace(/_/g, " ")}
              </p>
            )}
          </div>

          <div
            className={`
              flex items-center gap-2 rounded-full px-3 py-1
              text-[11px] font-semibold
              ${
                isLive
                  ? "bg-red-500/10 text-red-500"
                  : isScheduled
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-emerald-500/10 text-emerald-500"
              }
            `}
          >
            {isLive && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            )}
            {statusLabel}
          </div>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Home Team */}
          <div className="flex flex-col items-center text-center">
            <TeamCrest
              name={homeTeam.name}
              crest={homeTeam.crest}
              tla={homeTeam.tla}
            />

            <span
              className={`
              mt-3 min-h-[40px]
              text-sm font-semibold leading-tight
              ${
                homeWins
                  ? "text-emerald-500"
                  : "text-foreground"
              }
            `}
            >
              {teamInBangla(homeTeam.name)}
            </span>

            {homeWins && (
              <span className="mt-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                বিজয়ী
              </span>
            )}
          </div>

          {/* Scoreboard */}
          <div className="flex flex-col items-center">
            {isScheduled ? (
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-border" />
                <span className="text-2xl font-black text-primary">
                  VS
                </span>
                <div className="h-px w-6 bg-border" />
              </div>
            ) : (
              <div
                className="
                rounded-2xl
                border border-black/5 dark:border-white/10
                bg-black/3 dark:bg-white/4
                px-4 py-2
                "
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-black"
                    style={{
                      fontSize: 48,
                      lineHeight: 1,
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    {homeScore}
                  </span>

                  <span className="text-xl opacity-30">:</span>

                  <span
                    className="font-black"
                    style={{
                      fontSize: 48,
                      lineHeight: 1,
                      fontFamily: "'Bebas Neue', sans-serif",
                    }}
                  >
                    {awayScore}
                  </span>
                </div>
              </div>
            )}

            {isLive && (
              <span className="mt-2 text-xs font-semibold text-red-500">
                LIVE
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center text-center">
            <TeamCrest
              name={awayTeam.name}
              crest={awayTeam.crest}
              tla={awayTeam.tla}
            />

            <span
              className={`
              mt-3 min-h-[40px]
              text-sm font-semibold leading-tight
              ${
                awayWins
                  ? "text-emerald-500"
                  : "text-foreground"
              }
            `}
            >
              {teamInBangla(awayTeam.name)}
            </span>

            {awayWins && (
              <span className="mt-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                বিজয়ী
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="
          mt-6 flex items-center justify-center gap-3
          border-t border-black/5 pt-4
          text-xs text-muted-foreground
          dark:border-white/5
          "
        >
          <span>{banglaDate(utcDate)}</span>
          <span>•</span>
          <span>{banglaTime(utcDate)}</span>
        </div>
      </div>
    </div>
  );
}

function TeamCrest({
  name,
  crest,
  tla,
}: {
  name: string;
  crest?: string;
  tla?: string;
}) {
  return (
    <div
      className="
      relative h-16 w-16 overflow-hidden
      rounded-full border-2
      border-black/5 bg-white
      shadow-sm dark:border-white/10
      "
    >
      {crest ? (
        <Image
          src={crest}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-bold">
          {tla || "?"}
        </div>
      )}
    </div>
  );
}