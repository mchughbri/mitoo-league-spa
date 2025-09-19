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

  // Coloured stripe helper
  const getStripeClass = (position, totalTeams) => {
    if (position === 1) return "bg-green-500"; // leader
    if (position === 2 || position === 3) return "bg-blue-500"; // promotion/playoff
    if (position >= totalTeams - 1) return "bg-red-500"; // bottom 2
    return null;
  };

  // Clean team names (remove U7–U18, Under 13, etc.)
  const cleanTeamName = (name) => {
    return name
      .replace(/[\(\[\{]\s*U\s*\d{1,2}[A-Za-z]?'?s?\s*[\)\]\}]/gi, "")
      .replace(/\bU\s*\d{1,2}[A-Za-z]?'?s?\b/gi, "")
      .replace(/\bUnder\s*\d{1,2}\b/gi, "")
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

  const headers = rows[0];
  const dataRows = rows.slice(1);

  const teamIdx = headers.findIndex((h) => /team/i.test(h));
  const gfIndex = headers.indexOf("GF");
  const gaIndex = headers.indexOf("GA");

  // Build merged headers
  let mergedHeaders = headers
    .map((h, i) => {
      if (i === gfIndex) return "+/-";
      if (i === gaIndex) return null;
      if (/team/i.test(h)) return "Team"; // normalise "13 Teams" → "Team"
      if (/pos/i.test(h) || h === "Position") return "#"; // rename Pos → #
      return h;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        MHL U13 Table
      </h1>

      <div className="overflow-x-auto max-w-full sm:max-w-4xl mx-auto">
        <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-xs sm:text-sm md:text-base">
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

          <tbody>
            {dataRows.map((row, idx) => {
              const pos = parseInt(row[0], 10);
              const stripeClass = getStripeClass(pos, dataRows.length);

              return (
                <tr
                  key={idx}
                  className={`relative ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  {stripeClass && (
                    <td
                      className={`absolute left-0 top-0 bottom-0 w-1 ${stripeClass} rounded-l-lg`}
                    />
                  )}

                  {row.map((cell, i) => {
                    if (i === gaIndex) return null;

                    if (i === gfIndex) {
                      return (
                        <td
                          key={i}
                          className={`py-2 sm:py-3 px-2 sm:px-4 text-gray-700 ${
                            pos === 1 ? "font-bold" : "font-medium"
                          }`}
                        >
                          {row[gfIndex]}-{row[gaIndex]}
                        </td>
                      );
                    }

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
