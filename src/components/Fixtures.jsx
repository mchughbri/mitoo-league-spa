import { useEffect, useRef, useState } from "react";
import { cleanTeamName } from "../utils/teamName";
import StarIcon from "./StarIcon";
import BallIcon from "./BallIcon";
import { FixturesSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";

function ChevronIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MatchDetails({ m }) {
  return (
    <div className="mt-2 mx-5 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/60 flex items-start justify-between text-xs sm:text-sm">
      <div className="flex-1 text-right">
        {m.homeScorers.length > 0 ? (
          <ul className="space-y-0.5 text-gray-700 dark:text-gray-200">
            {m.homeScorers.map((s, i) => (
              <li key={i} className="flex items-center justify-end gap-1">
                {s} <BallIcon className="w-3.5 h-3.5 shrink-0" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 dark:text-gray-500">No scorers listed</p>
        )}
        {m.homeStar && (
          <p className="mt-1.5 flex items-center justify-end gap-1 text-yellow-600 dark:text-yellow-400 font-medium">
            <StarIcon filled className="w-3.5 h-3.5 shrink-0" />
            {m.homeStar}
          </p>
        )}
      </div>
      <span className="mx-3 px-2 py-1 whitespace-nowrap" aria-hidden="true" />
      <div className="flex-1 text-left">
        {m.awayScorers.length > 0 ? (
          <ul className="space-y-0.5 text-gray-700 dark:text-gray-200">
            {m.awayScorers.map((s, i) => (
              <li key={i} className="flex items-center gap-1">
                <BallIcon className="w-3.5 h-3.5 shrink-0" /> {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 dark:text-gray-500">No scorers listed</p>
        )}
        {m.awayStar && (
          <p className="mt-1.5 flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-medium">
            <StarIcon filled className="w-3.5 h-3.5 shrink-0" />
            {m.awayStar}
          </p>
        )}
      </div>
      <span className="w-5 shrink-0" aria-hidden="true" />
      <span className="w-5 shrink-0" aria-hidden="true" />
    </div>
  );
}

function MatchRow({ m, dateLabel, fav }) {
  const [expanded, setExpanded] = useState(false);
  const played = m.homeScore !== "" && m.awayScore !== "";
  const hasDetails =
    (m.homeScorers && m.homeScorers.length > 0) ||
    (m.awayScorers && m.awayScorers.length > 0) ||
    m.homeStar ||
    m.awayStar;
  const canExpand = played && hasDetails;

  return (
    <div className="px-4 py-2">
      {dateLabel && <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">{dateLabel}</div>}
      <div
        className={`flex items-center justify-between min-h-[44px] text-xs sm:text-sm md:text-base active:scale-[0.99] transition-transform ${
          canExpand ? "cursor-pointer" : ""
        }`}
        onClick={() => canExpand && setExpanded((e) => !e)}
      >
        <span className="flex-1 text-right font-medium text-gray-700 dark:text-gray-200">
          {cleanTeamName(m.homeTeam)}
        </span>
        <span className="mx-3 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
          {played ? `${m.homeScore} - ${m.awayScore}` : m.time || "v"}
        </span>
        <span className="flex-1 text-left font-medium text-gray-700 dark:text-gray-200">
          {cleanTeamName(m.awayTeam)}
        </span>
        <span className="w-5 shrink-0 flex justify-center">
          {fav && <StarIcon filled className="w-4 h-4" />}
        </span>
        <span className="w-5 shrink-0 flex justify-center text-gray-400 dark:text-gray-500">
          {canExpand && <ChevronIcon expanded={expanded} />}
        </span>
      </div>
      {canExpand && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div
            className={`overflow-hidden transition-opacity duration-200 ${
              expanded ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            <MatchDetails m={m} />
          </div>
        </div>
      )}
    </div>
  );
}

function Fixtures({ favorites = [] }) {
  const [month, setMonth] = useState(null);
  const [monthName, setMonthName] = useState("");
  const [seasonMonths, setSeasonMonths] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const touchStart = useRef(null);

  const loadMonth = (monthNo) => {
    setLoading(true);
    setError(false);
    const query = monthNo ? `?month=${monthNo}` : "";
    fetch(`/api/fixtures${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.month) throw new Error("bad response");
        setMonth(data.month);
        setMonthName(data.monthName);
        setSeasonMonths(data.seasonMonths || []);
        setFixtures(data.fixtures || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMonth();
  }, []);

  const monthIndex = seasonMonths.indexOf(month);
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex !== -1 && monthIndex < seasonMonths.length - 1;

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0 && canGoNext) loadMonth(seasonMonths[monthIndex + 1]);
    if (dx > 0 && canGoPrev) loadMonth(seasonMonths[monthIndex - 1]);
  };

  const isFavoriteMatch = (m) =>
    favorites.includes(cleanTeamName(m.homeTeam)) ||
    favorites.includes(cleanTeamName(m.awayTeam));

  const favoriteMatches = fixtures.flatMap((day) =>
    day.matches
      .filter(isFavoriteMatch)
      .map((m) => ({ ...m, date: day.date }))
  );

  if (loading) {
    return <FixturesSkeleton />;
  }

  if (error) {
    return <EmptyState variant="error" message="Could not load fixtures." />;
  }

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto">
      <div
        className="flex items-center justify-between mb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={() => canGoPrev && loadMonth(seasonMonths[monthIndex - 1])}
          disabled={!canGoPrev}
          className="min-h-[44px] px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 shadow disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm sm:text-base active:scale-95 transition-transform"
        >
          ← Prev
        </button>
        <h2 className="text-lg sm:text-xl font-bold">{monthName}</h2>
        <button
          onClick={() => canGoNext && loadMonth(seasonMonths[monthIndex + 1])}
          disabled={!canGoNext}
          className="min-h-[44px] px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-100 shadow disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm sm:text-base active:scale-95 transition-transform"
        >
          Next →
        </button>
      </div>

      {favoriteMatches.length > 0 && (
        <div className="p-[2px] bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 shadow-card mb-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-4 py-2 font-semibold text-sm sm:text-base flex items-center gap-2">
              <StarIcon filled className="w-5 h-5" />
              Favourites
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {favoriteMatches.map((m, i) => (
                <MatchRow key={i} m={m} dateLabel={m.date} fav />
              ))}
            </div>
          </div>
        </div>
      )}

      {fixtures.length === 0 ? (
        <EmptyState message={`No fixtures scheduled for ${monthName}.`} />
      ) : (
        <div className="space-y-4">
          {fixtures.map((day, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 shadow-card overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 font-semibold text-sm sm:text-base">
                {day.date}
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {day.matches.map((m, j) => (
                  <MatchRow key={j} m={m} fav={isFavoriteMatch(m)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Fixtures;
