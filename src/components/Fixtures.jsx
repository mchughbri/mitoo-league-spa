import { useEffect, useState } from "react";
import { cleanTeamName } from "../utils/teamName";
import StarIcon from "./StarIcon";

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
    <div className="mt-2 mx-5 p-3 rounded-lg bg-gray-50 grid grid-cols-2 gap-3 text-xs sm:text-sm">
      <div>
        <div className="font-semibold text-gray-600 mb-1">
          {cleanTeamName(m.homeTeam)}
        </div>
        {m.homeScorers.length > 0 ? (
          <ul className="space-y-0.5 text-gray-700">
            {m.homeScorers.map((s, i) => (
              <li key={i}>⚽ {s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No scorers listed</p>
        )}
        {m.homeStar && (
          <p className="mt-1.5 flex items-center gap-1 text-yellow-600 font-medium">
            <StarIcon filled className="w-3.5 h-3.5 shrink-0" />
            {m.homeStar}
          </p>
        )}
      </div>
      <div>
        <div className="font-semibold text-gray-600 mb-1">
          {cleanTeamName(m.awayTeam)}
        </div>
        {m.awayScorers.length > 0 ? (
          <ul className="space-y-0.5 text-gray-700">
            {m.awayScorers.map((s, i) => (
              <li key={i}>⚽ {s}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No scorers listed</p>
        )}
        {m.awayStar && (
          <p className="mt-1.5 flex items-center gap-1 text-yellow-600 font-medium">
            <StarIcon filled className="w-3.5 h-3.5 shrink-0" />
            {m.awayStar}
          </p>
        )}
      </div>
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
      {dateLabel && <div className="text-xs text-gray-400 mb-1">{dateLabel}</div>}
      <div
        className={`flex items-center justify-between text-xs sm:text-sm md:text-base ${
          canExpand ? "cursor-pointer" : ""
        }`}
        onClick={() => canExpand && setExpanded((e) => !e)}
      >
        <span className="flex-1 text-right font-medium text-gray-700">
          {cleanTeamName(m.homeTeam)}
        </span>
        <span className="mx-3 px-2 py-1 rounded bg-gray-100 font-semibold text-gray-800 whitespace-nowrap">
          {played ? `${m.homeScore} - ${m.awayScore}` : m.time || "v"}
        </span>
        <span className="flex-1 text-left font-medium text-gray-700">
          {cleanTeamName(m.awayTeam)}
        </span>
        <span className="w-5 shrink-0 flex justify-center">
          {fav && <StarIcon filled className="w-4 h-4" />}
        </span>
        <span className="w-5 shrink-0 flex justify-center text-gray-400">
          {canExpand && <ChevronIcon expanded={expanded} />}
        </span>
      </div>
      {canExpand && expanded && <MatchDetails m={m} />}
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

  const isFavoriteMatch = (m) =>
    favorites.includes(cleanTeamName(m.homeTeam)) ||
    favorites.includes(cleanTeamName(m.awayTeam));

  const favoriteMatches = fixtures.flatMap((day) =>
    day.matches
      .filter(isFavoriteMatch)
      .map((m) => ({ ...m, date: day.date }))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p>Loading fixtures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-500">Could not load fixtures.</p>
      </div>
    );
  }

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => canGoPrev && loadMonth(seasonMonths[monthIndex - 1])}
          disabled={!canGoPrev}
          className="px-3 py-1.5 rounded-lg bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
        >
          ← Prev
        </button>
        <h2 className="text-lg sm:text-xl font-bold">{monthName}</h2>
        <button
          onClick={() => canGoNext && loadMonth(seasonMonths[monthIndex + 1])}
          disabled={!canGoNext}
          className="px-3 py-1.5 rounded-lg bg-white shadow disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
        >
          Next →
        </button>
      </div>

      {favoriteMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 ring-2 ring-yellow-400">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 font-semibold text-sm sm:text-base flex items-center gap-2">
            <StarIcon filled className="w-5 h-5" />
            Favourites
          </div>
          <div className="divide-y divide-gray-100">
            {favoriteMatches.map((m, i) => (
              <MatchRow key={i} m={m} dateLabel={m.date} fav />
            ))}
          </div>
        </div>
      )}

      {fixtures.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-500">No fixtures scheduled for {monthName}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fixtures.map((day, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 font-semibold text-sm sm:text-base">
                {day.date}
              </div>
              <div className="divide-y divide-gray-100">
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
