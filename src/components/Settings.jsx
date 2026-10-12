import { useEffect, useState } from "react";
import { cleanTeamName } from "../utils/teamName";
import StarIcon from "./StarIcon";

function Settings({ favorites, onToggleFavorite }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/scrape")
      .then((res) => res.json())
      .then((data) => {
        const rows = data.rows || [];
        if (rows.length === 0) throw new Error("no rows");

        const headers = rows[0];
        const teamIdx = headers.findIndex((h) => /team/i.test(h));
        const dataRows = rows
          .slice(1)
          .filter((row) => row.length === headers.length);

        const names = dataRows
          .map((row) => cleanTeamName(String(row[teamIdx] ?? "")))
          .filter(Boolean);

        setTeams(names);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p>Loading teams...</p>
      </div>
    );
  }

  if (error || teams.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-500">Could not load teams.</p>
      </div>
    );
  }

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 font-semibold text-sm sm:text-base">
          Favourite Teams
        </div>
        <p className="px-4 pt-3 pb-1 text-xs sm:text-sm text-gray-500">
          Star your team(s) to see their fixtures highlighted at the top of
          the Fixtures tab.
        </p>
        <div className="divide-y divide-gray-100">
          {teams.map((team) => {
            const isFavorite = favorites.includes(team);
            return (
              <button
                key={team}
                type="button"
                onClick={() => onToggleFavorite(team)}
                className="w-full flex items-center justify-between px-4 py-3 text-left text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>{team}</span>
                <StarIcon filled={isFavorite} className="w-6 h-6 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Settings;
