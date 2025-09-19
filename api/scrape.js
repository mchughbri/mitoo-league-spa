import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://football.mitoo.co.uk/LeagueTab.cfm?TblName=Matches&DivisionID=856&LeagueCode=MHRML2025"
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    const rows = [];
    $("table tr").each((_, el) => {
      const cells = $(el)
        .find("td, th")
        .map((i, td) => $(td).text().trim())
        .get();
      if (cells.length > 0) rows.push(cells);
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
}
