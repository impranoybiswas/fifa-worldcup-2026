"use client";

import { teamInBangla } from "@/lib/team-bangla";
import { banglaDate, banglaTime } from "@/lib/bangla-date";
import { Match } from "@/types/match";
import Image from "next/image";

export default function MatchCard({ match }: { match: Match }) {
  // ১. সেফটি চেক
  if (!match || (!match.homeTeam?.name && !match.awayTeam?.name)) return null;

  const { homeTeam, awayTeam, status, utcDate, stage, group, score, referees } =
    match;

  // ২. ম্যাচের বর্তমান অবস্থা বা স্ট্যাটাস ফ্ল্যাগস
  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isFinished = status === "FINISHED";
  const isScheduled = status === "TIMED" || status === "SCHEDULED";

  // ৩. স্কোরের সেফ হ্যান্ডলিং
  const homeScore = score?.fullTime?.home ?? 0;
  const awayScore = score?.fullTime?.away ?? 0;

  // ৪. উইনার হাইলাইট লজিক
  const homeWins = isFinished && homeScore > awayScore;
  const awayWins = isFinished && awayScore > homeScore;
  const isDraw = isFinished && homeScore === awayScore;

  // ৫. ডাইনামিক বাংলা স্ট্যাটাস লেবেল নির্ধারণ
  const statusLabel = isLive
    ? status === "PAUSED"
      ? "মধ্য বিরতি"
      : "লাইভ"
    : isFinished
      ? "শেষ"
      : "শুরু হবে";

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-5 border border-black/6 rounded-2xl bg-white/90 backdrop-blur-md flex flex-col gap-5 shadow-md hover:shadow-lg transition-all duration-300">
      {/* টপ সেকশন: ম্যাচ মেটাডেটা (স্টেজ, তারিখ, সময় ও রেফারি) */}
      <div className="border-b border-black/5 pb-4 flex flex-col items-center justify-center gap-2">
        {/* টুর্নামেন্ট স্টেজ ও গ্রুপ */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span className="bg-slate-100 px-2 py-0.5 rounded">
            {stage?.replace(/_/g, " ") || "WORLD CUP"}
          </span>
          {group && (
            <>
              <span className="text-slate-300">•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">
                {group.replace(/_/g, " ")}
              </span>
            </>
          )}
        </div>

        {/* বাংলা তারিখ ও সময় ক্যাপসুল */}
        <div className="flex items-center gap-2 text-xs text-slate-700 font-bold bg-slate-100/80 border border-slate-200/50 px-3.5 py-1 rounded-full tabular-nums shadow-sm">
          <span>{banglaDate(utcDate)}</span>
          <span className="text-slate-300">•</span>
          <span>{banglaTime(utcDate)}</span>
        </div>

        {/* রেফারি ইনফরমেশন */}
        {referees && referees.length > 0 && (
          <div className="text-[10px] text-slate-400 font-medium tracking-wide">
            Referee:{" "}
            <span className="text-slate-600 font-semibold">
              {referees[0].name || "N/A"}
            </span>{" "}
            ({referees[0].nationality || "N/A"})
          </div>
        )}
      </div>

      {/* বটম সেকশন: মূল গ্রিড স্কোরবোর্ড (৩ কলাম লেআউট) */}
      <div className="relative">
        <div className="grid grid-cols-3 items-center justify-center gap-3 sm:gap-4">
          {/* কলাম ১: হোম টিম কার্ড */}
          <div
            className={`relative flex flex-col items-center rounded-xl border p-3 pt-4 gap-2 transition-all duration-300 h-full justify-between
              ${homeWins ? "bg-emerald-50/40 border-emerald-500/20 shadow-sm ring-1 ring-emerald-500/10" : "bg-slate-50/50 border-black/4"}
              ${isFinished && !homeWins && !isDraw ? "opacity-40 filter grayscale-15" : ""}
            `}
          >
            {/* উইনার ব্যাজ */}
            {homeWins && (
              <span className="absolute -top-2.5 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                ✓ জয়ী
              </span>
            )}

            <TeamFlag team={homeTeam} isLive={isLive} />

            <p
              className={`text-[10px] sm:text-sm w-full text-center truncate tracking-tight px-1 mt-1 ${homeWins ? "text-emerald-600 font-extrabold" : "text-slate-800 font-semibold"}`}
            >
              {teamInBangla(homeTeam.name)}
            </p>
          </div>

          {/* কলাম ২: লাইভ স্কোর বা বনাম (VS) ডিসপ্লে */}
          <div className="flex flex-col items-center justify-center tabular-nums">
            {isScheduled ? (
              <span className="text-2xl font-black tracking-widest text-slate-300 font-sans">
                VS
              </span>
            ) : (
              <div className="flex gap-2.5 items-center tracking-tighter text-3xl sm:text-4xl font-extrabold text-slate-900">
                <span className={homeWins ? "text-emerald-600" : ""}>
                  {homeScore}
                </span>
                <span className="text-xl opacity-20 text-slate-400 font-light">
                  :
                </span>
                <span className={awayWins ? "text-emerald-600" : ""}>
                  {awayScore}
                </span>
              </div>
            )}

            {/* ডাইনামিক স্ট্যাটাস ব্যাজ */}
            <div
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-0.5
                text-[9px] font-extrabold uppercase tracking-wider mt-3 shadow-xs border
                ${
                  isLive
                    ? "bg-red-500 text-white border-red-600 animate-pulse"
                    : isScheduled
                      ? "bg-blue-50/80 text-blue-600 border-blue-200/60"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                }
              `}
            >
              {isLive && (
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
              )}
              {statusLabel}
            </div>
          </div>

          {/* কলাম ৩: অ্যাওয়ে টিম কার্ড */}
          <div
            className={`relative flex flex-col items-center rounded-xl border p-3 pt-4 gap-2 transition-all duration-300 h-full justify-between
              ${awayWins ? "bg-emerald-50/40 border-emerald-500/20 shadow-sm ring-1 ring-emerald-500/10" : "bg-slate-50/50 border-black/4"}
              ${isFinished && !awayWins && !isDraw ? "opacity-40 filter grayscale-15" : ""}
            `}
          >
            {/* উইনার ব্যাজ */}
            {awayWins && (
              <span className="absolute -top-2.5 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                ✓ জয়ী
              </span>
            )}

            <TeamFlag team={awayTeam} isLive={isLive} />

            <p
              className={`text-[10px] sm:text-sm w-full text-center truncate tracking-tight px-1 mt-1 ${awayWins ? "text-emerald-600 font-extrabold" : "text-slate-800 font-semibold"}`}
            >
              {teamInBangla(awayTeam.name)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ফ্ল্যাগের জন্য ক্লিন রি-ইউজেবল সাব-কম্পোনেন্ট
function TeamFlag({
  team,
  isLive,
}: {
  team: Match["homeTeam"] | Match["awayTeam"];
  isLive: boolean;
}) {
  return (
    <div className="border border-black/6 shadow-xs w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden bg-slate-100/70 flex items-center justify-center shrink-0">
      {team.crest ? (
        <Image
          src={team.crest}
          alt={team.name}
          height={80}
          width={120}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          priority={isLive}
        />
      ) : (
        <span className="font-extrabold text-sm sm:text-base text-slate-500 uppercase tracking-wider">
          {team.tla || "?"}
        </span>
      )}
    </div>
  );
}
