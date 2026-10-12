import { useEffect, useState } from "react";
import { cleanTeamName } from "../utils/teamName";
import StarIcon from "./StarIcon";

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
            {favoriteMatches.map((m, i) => {
              const played = m.homeScore !== "" && m.awayScore !== "";
              return (
                <div key={i} className="px-4 py-2">
                  <div className="text-xs text-gray-400 mb-1">{m.date}</div>
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
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
                      <StarIcon filled className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
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
                {day.matches.map((m, j) => {
                  const played = m.homeScore !== "" && m.awayScore !== "";
                  const fav = isFavoriteMatch(m);
                  return (
                    <div
                      key={j}
                      className="flex items-center justify-between px-4 py-2 text-xs sm:text-sm md:text-base"
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Fixtures;
