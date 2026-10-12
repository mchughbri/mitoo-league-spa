import * as cheerio from "cheerio";

// The season runs September through March for this division/age group.
const SEASON_MONTHS = [9, 10, 11, 12, 1, 2, 3];
const MONTH_NAMES = {
  1: "January",
  2: "February",
  3: "March",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

function resolveMonth(requested) {
  if (SEASON_MONTHS.includes(requested)) return requested;
  const now = new Date().getMonth() + 1;
  if (SEASON_MONTHS.includes(now)) return now;
  return SEASON_MONTHS[0];
}

export default async function handler(req, res) {
  try {
    const requested = parseInt(req.query?.month, 10);
    const month = resolveMonth(requested);

    const response = await fetch(
      `https://mitoofootball.com/FixtResMonth.cfm?TblName=Matches&DivisionID=623&LeagueCode=MHRML2026&MonthNo=${month}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
        },
      }
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    const days = [];
    let current = null;

    $("table.white tr").each((_, el) => {
      const row = $(el);

      const heading = row.find("td.mainHeading").first();
      if (heading.length) {
        const label = heading.text().replace(/\s+/g, " ").trim();
        if (label) {
          current = { date: label, matches: [] };
          days.push(current);
        }
        return;
      }

      if (row.hasClass("bg_contrast") && current) {
        const scoreCells = row.find('td[width="35"]');
        const homeScore = scoreCells.eq(0).text().replace(/\s+/g, " ").trim();
        const awayScore = scoreCells.eq(1).text().replace(/\s+/g, " ").trim();

        const matchCell = row.find("td").eq(2);
        const teamSpans = matchCell.find("span.pix13bold");
        const homeTeam = teamSpans.eq(0).text().replace(/\s+/g, " ").trim();
        const awayTeam = teamSpans.eq(1).text().replace(/\s+/g, " ").trim();
        const time = matchCell
          .find("span.pix10brand strong")
          .first()
          .text()
          .trim();

        if (homeTeam && awayTeam) {
          current.matches.push({ homeTeam, awayTeam, homeScore, awayScore, time });
        }
      }
    });

    const fixtures = days.filter((d) => d.matches.length > 0);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      month,
      monthName: MONTH_NAMES[month],
      seasonMonths: SEASON_MONTHS,
      fixtures,
      debug: { upstreamStatus: response.status, htmlLength: html.length },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}
