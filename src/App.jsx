import { useEffect, useState } from "react";
import Fixtures from "./components/Fixtures";
import LeagueTable from "./components/LeagueTable";
import Settings from "./components/Settings";
import { loadFavorites, saveFavorites } from "./utils/favorites";

function App() {
  const [tab, setTab] = useState("fixtures");
  const [favorites, setFavorites] = useState(() => loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = (team) => {
    setFavorites((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  const tabClass = (name) =>
    `flex-1 py-2 sm:py-3 text-center font-semibold rounded-lg transition-colors ${
      tab === name
        ? "bg-indigo-600 text-white shadow"
        : "bg-white text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        MHL U14s
      </h1>

      <div className="max-w-full sm:max-w-4xl mx-auto mb-6 flex gap-2">
        <button className={tabClass("fixtures")} onClick={() => setTab("fixtures")}>
          Fixtures
        </button>
        <button className={tabClass("table")} onClick={() => setTab("table")}>
          Table
        </button>
        <button className={tabClass("settings")} onClick={() => setTab("settings")}>
          Settings
        </button>
      </div>

      {tab === "fixtures" && <Fixtures favorites={favorites} />}
      {tab === "table" && <LeagueTable favorites={favorites} />}
      {tab === "settings" && (
        <Settings favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
    </div>
  );
}

export default App;


