import { useEffect, useState } from "react";
import { cleanTeamName } from "../utils/teamName";
import StarIcon from "./StarIcon";
import { ListSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";

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
    return <ListSkeleton />;
  }

  if (error || teams.length === 0) {
    return <EmptyState variant="error" message="Could not load teams." />;
  }

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-card overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 font-semibold text-sm sm:text-base">
          Favourite Teams
        </div>
        <p className="px-4 pt-3 pb-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Star your team(s) to see their fixtures highlighted at the top of
          the Fixtures tab.
        </p>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {teams.map((team) => {
            const isFavorite = favorites.includes(team);
            return (
              <button
                key={team}
                type="button"
                onClick={() => onToggleFavorite(team)}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-left text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-transform"
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
