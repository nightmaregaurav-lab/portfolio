import {transliterate} from "transliteration";

function normalizeSearchText(value: string) {
  // Transliterate non-Latin characters (Devanagari, Greek, Chinese, Cyrillic, etc.) before processing
  const transliterated = value
    .split("")
    .map(ch => ch.charCodeAt(0) > 127 ? transliterate(ch) : ch)
    .join("");

  return transliterated
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function getEditDistance(first: string, second: string) {
  const distances = Array.from(
    {length: first.length + 1},
    () => Array.from({length: second.length + 1}, () => 0)
  );

  for (let firstIndex = 0; firstIndex <= first.length; firstIndex++) {
    distances[firstIndex][0] = firstIndex;
  }

  for (let secondIndex = 0; secondIndex <= second.length; secondIndex++) {
    distances[0][secondIndex] = secondIndex;
  }

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex++) {
    for (let secondIndex = 1; secondIndex <= second.length; secondIndex++) {
      const substitutionCost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1;

      distances[firstIndex][secondIndex] = Math.min(
        distances[firstIndex - 1][secondIndex] + 1,
        distances[firstIndex][secondIndex - 1] + 1,
        distances[firstIndex - 1][secondIndex - 1] + substitutionCost
      );

      if (
        firstIndex > 1 &&
        secondIndex > 1 &&
        first[firstIndex - 1] === second[secondIndex - 2] &&
        first[firstIndex - 2] === second[secondIndex - 1]
      ) {
        distances[firstIndex][secondIndex] = Math.min(
          distances[firstIndex][secondIndex],
          distances[firstIndex - 2][secondIndex - 2] + 1
        );
      }
    }
  }

  return distances[first.length][second.length];
}

function getWordScore(word: string, query: string) {
  if (word === query) return 0;
  if (word.startsWith(query)) return 1 + word.length - query.length;
  if (word.includes(query)) return 5 + word.indexOf(query);

  const distance = getEditDistance(word, query);
  const maxDistance = Math.max(1, Math.floor(query.length * 0.25));

  return distance <= maxDistance
    ? 20 + distance * 10 + Math.abs(word.length - query.length)
    : Infinity;
}

function getFuzzyScore(searchText: string, query: string) {
  const normalizedText = normalizeSearchText(searchText);
  const compactText = normalizedText.replace(/\s/g, "");
  const words = normalizedText.split(" ");

  if (normalizedText === query) return 0;
  if (normalizedText.startsWith(query)) return 10 + normalizedText.length - query.length;
  if (normalizedText.includes(query)) return 20 + normalizedText.indexOf(query);

  const compactQuery = query.replace(/\s/g, "");
  if (compactText.startsWith(compactQuery)) return 30 + compactText.length - compactQuery.length;
  if (compactText.includes(compactQuery)) return 40 + compactText.indexOf(compactQuery);

  const queryWords = query.split(" ").filter(Boolean);
  let score = 0;

  for (const queryWord of queryWords) {
    const bestWordScore = Math.min(
      ...words.map((word) => getWordScore(word, queryWord))
    );

    if (!Number.isFinite(bestWordScore)) return Infinity;
    score += bestWordScore;
  }

  return 100 + score + Math.abs(words.length - queryWords.length);
}

/** Filters and ranks values by searchable text, including close spelling matches. */
export function fuzzySearch<T>(
  items: readonly T[],
  query: string,
  getSearchText: (item: T) => string
) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [...items];

  return items
    .map((item, index) => ({
      item,
      index,
      score: getFuzzyScore(getSearchText(item), normalizedQuery),
    }))
    .filter(({score}) => Number.isFinite(score))
    .sort((first, second) => first.score - second.score || first.index - second.index)
    .map(({item}) => item);
}
