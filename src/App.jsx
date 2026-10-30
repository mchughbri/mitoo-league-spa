import { useEffect, useState } from "react";
import Fixtures from "./components/Fixtures";
import LeagueTable from "./components/LeagueTable";
import Settings from "./components/Settings";
import { loadFavorites, saveFavorites } from "./utils/favorites";
import { getInitialTheme, applyTheme } from "./utils/theme";
import { CalendarIcon, TableIcon, GearIcon } from "./components/NavIcons";
import AppLogo from "./components/AppLogo";

const TABS = [
  { id: "fixtures", label: "Fixtures", Icon: CalendarIcon },
  { id: "table", label: "Table", Icon: TableIcon },
  { id: "settings", label: "Settings", Icon: GearIcon },
];

function App() {
  const [tab, setTab] = useState("fixtures");
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleFavorite = (team) => {
    setFavorites((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-20 bg-indigo-600 dark:bg-indigo-700 text-white shadow pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-center gap-2 py-3">
          <AppLogo className="w-8 h-8" />
          <h1 className="text-lg sm:text-2xl font-bold">MHL U14s</h1>
        </div>
      </header>

      <main className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        <div key={tab} className="animate-fadeIn">
          {tab === "fixtures" && <Fixtures favorites={favorites} />}
          {tab === "table" && <LeagueTable favorites={favorites} />}
          {tab === "settings" && (
            <Settings
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              theme={theme}
              onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            />
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-full sm:max-w-4xl mx-auto flex">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-2 text-xs font-medium transition-colors active:scale-95 ${
                tab === id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;


