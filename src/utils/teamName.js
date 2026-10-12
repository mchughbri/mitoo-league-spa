// Clean team names (remove U7–U18, Under 13, etc.)
export function cleanTeamName(name) {
  return String(name)
    .replace(/[\(\[\{]\s*U\s*\d{1,2}[A-Za-z]?'?s?\s*[\)\]\}]/gi, "")
    .replace(/\bU\s*\d{1,2}[A-Za-z]?'?s?\b/gi, "")
    .replace(/\bUnder\s*\d{1,2}\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*-\s*$/g, "")
    .trim();
}
