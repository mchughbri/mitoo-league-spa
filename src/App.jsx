import { useEffect, useState } from "react";

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scrape")
      .then(res => res.json())
      .then(data => {
        setRows(data.rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        League Table
      </h1>

      {loading && <p className="text-center">Loading table...</p>}

      {!loading && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-md">
            <thead className="bg-gray-200">
              <tr>
                {rows[0].map((cell, i) => (
                  <th key={i} className="py-3 px-4 text-left font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className="py-3 px-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && rows.length === 0 && (
        <p className="text-center text-red-500">
          Could not load table.
        </p>
      )}
    </div>
  );
}

export default App;
