import { useEffect, useState } from "react";

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scrape")
      .then((res) => res.json())
      .then((data) => {
        setRows(data.rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Coloured stripe helper (FotMob/Sky feel)
  const getStripeClass = (position, totalTeams) => {
    if (position === 1) return "bg-green-500";          // leader
    if (position === 2 || position === 3) return "bg-blue-500"; // promotion/playoff
    if (position >= totalTeams - 1) return "bg-red-500"; // bottom 2
    return null;
  };

  // Robust team-name cleaner: strips U7–U18, variants, and (U13) forms
  const cleanTeamName = (name) => {
    return name
      // Remove bracketed age tags like (U13), [U13], {U13}, and variants
      .replace(/[\(\[\{]\s*U\s*\d{1,2}[A-Za-z]?'?s?\s*[\)\]\}]/gi, "")
      // Remove standalone U13/U 13/U13s/U13’s/U13A token
      .replace(/\bU\s*\d{1,2}[A-Za-z]?'?s?\b/gi, "")
      // Remove "Under 13" etc.
      .replace(/\bUnder\s*\d{1,2}\b/gi, "")
      // Collapse multiple spaces and tidy trailing hyphens/spaces
      .replace(/\s{2,}/g, " ")
      .replace(/\s*-\s*$/g, "")
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading table...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Could not load league table.</p>
      </div>
    );
  }

  // Headers & data
  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Column indexes (robust to naming)
  const teamIdx = headers.findIndex((h) => /team/i.test(h));
  const gfIndex = headers.indexOf("GF");
  const gaIndex = headers.indexOf("GA");

  // Build headers shown in UI: merge GF/GA into "+/-"
  const mergedHeaders = (() => {
    if (gfIndex === -1 || gaIndex === -1) return headers; // fallback if not found
    return headers
      .map((h, i) => {
        if (i === gfIndex) return "+/-";
        if (i === gaIndex) return null; // drop GA
        return h;
      })
      .filter(Boolean);
  })();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        MHL U13 Table
      </h1>

      <div className="overflow-x-auto max-w-full sm:max-w-4xl mx-auto">
        <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-xs sm:text-sm md:text-base">
          {/* Table Head */}
          <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
            <tr>
              {mergedHeaders.map((cell, i) => (
                <th
                  key={i}
                  className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold tracking-wide whitespace-nowrap"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {dataRows.map((row, idx) => {
              const pos = parseInt(row[0], 10); // position is first column
              const stripeClass = getStripeClass(pos, dataRows.length);

              return (
                <tr
                  key={idx}
                  className={`relative ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {/* Coloured tab for positions */}
                  {stripeClass && (
                    <td
                      className={`absolute left-0 top-0 bottom-0 w-1 ${stripeClass} rounded-l-lg`}
                    />
                  )}

                  {row.map((cell, i) => {
                    // Skip GA (merged)
                    if (gaIndex !== -1 && i === gaIndex) return null;

                    // Merge GF/GA into "+/-"
                    if (gfIndex !== -1 && i === gfIndex) {
                      const gf = row[gfIndex] ?? "";
                      const ga = row[gaIndex] ?? "";
                      return (
                        <td
                          key={i}
                          className={`py-2 sm:py-3 px-2 sm:px-4 text-gray-700 ${
                            pos === 1 ? "font-bold" : "font-medium"
                          }`}
                        >
                          {gf}-{ga}
                        </td>
                      );
                    }

                    // Clean team names in the team column
                    if (i === teamIdx && teamIdx !== -1) {
                      const clean = cleanTeamName(String(cell));
                      return (
                        <td
                          key={i}
                          className={`py-2 sm:py-3 px-2 sm:px-4 text-gray-700 ${
                            pos === 1 ? "font-bold" : "font-medium"
                          }`}
                        >
                          {clean}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={i}
                        className={`py-2 sm:py-3 px-2 sm:px-4 text-gray-700 ${
                          pos === 1 ? "font-bold" : "font-medium"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
