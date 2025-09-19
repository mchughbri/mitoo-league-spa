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

  // Helper: determine stripe colour based on league position
  const getStripeClass = (position, totalTeams) => {
    if (position === 1) return "bg-green-500"; // champion
    if (position === 2 || position === 3) return "bg-blue-500"; // promotion/playoff
    if (position >= totalTeams - 1) return "bg-red-500"; // bottom 2
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        Division Table
      </h1>

      {loading && <p className="text-center">Loading table...</p>}

      {!loading && rows.length > 0 && (
        <div className="overflow-x-auto max-w-full sm:max-w-4xl mx-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-xs sm:text-sm md:text-base">
            {/* Table Head */}
            <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
              <tr>
                {rows[0].map((cell, i) => (
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
              {rows.slice(1).map((row, idx) => {
                const pos = parseInt(row[0], 10); // league position = first column
                const stripeClass = getStripeClass(pos, rows.length - 1);

                return (
                  <tr
                    key={idx}
                    className={`relative ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    {/* Coloured tab if needed */}
                    {stripeClass && (
                      <td
                        className={`absolute left-0 top-0 bottom-0 w-1 ${stripeClass} rounded-l-lg`}
                      ></td>
                    )}

                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={`py-2 sm:py-3 px-2 sm:px-4 text-gray-700 ${
                          pos === 1 ? "font-bold" : "font-medium"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-center text-red-500">
          Could not load league table.
        </p>
      )}
    </div>
  );
}

export default App;
