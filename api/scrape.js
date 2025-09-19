import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://football.mitoo.co.uk/LeagueTab.cfm?TblName=Matches&DivisionID=856&LeagueCode=MHRML2025"
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    const headerMap = {
      "Position": "Pos",
      "Team Name": "Team",
      "Games Played": "Pl",
      "Played": "Pl",
      "Won": "W",
      "Drawn": "D",
      "Lost": "L",
      "Goals For": "GF",
      "Goals Against": "GA",
      "Goal Difference": "GD",
      "Points": "Pts",
    };

    const rows = [];
    $("table.leagueTable tr").each((rowIndex, el) => {
      const cells = $(el)
        .find("td, th")
        .map((i, td) => $(td).text().trim().replace(/\s+/g, " "))
        .get();

      if (cells.length > 0) {
        // If it's the header row → map to short labels
        if (rowIndex === 0) {
          rows.push(cells.map((c) => headerMap[c] || c));
        } else {
          rows.push(cells);
        }
      }
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
}
