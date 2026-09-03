const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const STOP_WORDS = new Set([
  "and", "the", "for", "from", "into", "with", "through", "that", "this", "one", "ones",
  "people", "person", "ways", "work", "working", "use", "using", "useful", "well"
]);

function stem(word) {
  return word
    .replace(/ies$/u, "y")
    .replace(/(ing|ers|er|ed|es|s)$/u, "")
    .replace(/tion$/u, "t");
}

function tokens(text) {
  return new Set((text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? [])
    .map(stem)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word)));
}

export function lexicalAffinity(text, theme) {
  const answerTokens = tokens(text);
  if (!answerTokens.size) return 0;
  const themeTokens = tokens(`${theme.label} ${theme.description}`);
  let matches = 0;
  for (const token of answerTokens) {
    if (themeTokens.has(token)) matches += 1;
  }
  return clamp(matches / Math.min(3, answerTokens.size), 0, 1);
}

export function cosineSimilarity(a, b) {
  if (!a?.length || a.length !== b?.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator ? dot / denominator : 0;
}

export function scoreAreas(areaVectors, themeVectors, themes, areaTexts = {}) {
  const byArea = {};
  for (const [areaId, vector] of Object.entries(areaVectors)) {
    const semantic = themes.map((theme, index) => ({
      ...theme,
      rawScore: cosineSimilarity(vector, themeVectors[index])
    }));
    const rawScores = semantic.map((item) => item.rawScore);
    const rawFloor = Math.min(...rawScores);
    const rawCeiling = Math.max(...rawScores);
    const rawRange = rawCeiling - rawFloor || 1;
    const combined = semantic.map((item) => {
      const semanticScore = clamp((item.rawScore - rawFloor) / rawRange, 0, 1);
      const lexicalScore = lexicalAffinity(areaTexts[areaId] ?? "", item);
      const lexicalWeight = tokens(areaTexts[areaId] ?? "").size <= 5 ? 0.5 : 0.22;
      return { ...item, combinedScore: semanticScore * (1 - lexicalWeight) + lexicalScore * lexicalWeight };
    }).sort((a, b) => b.combinedScore - a.combinedScore);

    const scores = combined.map((item) => item.combinedScore);
    const floor = Math.min(...scores);
    const ceiling = Math.max(...scores);
    const range = ceiling - floor || 1;
    byArea[areaId] = combined.map((item) => ({
      ...item,
      score: Math.round(clamp((item.combinedScore - floor) / range, 0, 1) * 100)
    }));
  }
  return byArea;
}

export function findIntersections(byArea, themes, topPerArea = 10) {
  const areaIds = Object.keys(byArea);
  return themes.map((theme) => {
    const areaScores = Object.fromEntries(areaIds.map((areaId) => {
      const match = byArea[areaId].find((item) => item.id === theme.id);
      return [areaId, match?.score ?? 0];
    }));
    const strongAreas = areaIds.filter((areaId) => byArea[areaId].slice(0, topPerArea).some((item) => item.id === theme.id));
    const sortedScores = Object.values(areaScores).sort((a, b) => b - a);
    const breadth = strongAreas.length / areaIds.length;
    const balance = sortedScores.slice(0, Math.max(2, strongAreas.length)).reduce((sum, value) => sum + value, 0) / Math.max(2, strongAreas.length);
    return { ...theme, areaScores, strongAreas, relevance: Math.round(balance * 0.72 + breadth * 28) };
  }).filter((item) => item.strongAreas.length >= 2)
    .sort((a, b) => b.relevance - a.relevance);
}

export function topOverall(byArea, themes) {
  const areaIds = Object.keys(byArea);
  return themes.map((theme) => {
    const scores = areaIds.map((areaId) => byArea[areaId].find((item) => item.id === theme.id)?.score ?? 0);
    const topTwo = [...scores].sort((a, b) => b - a).slice(0, 2);
    return { ...theme, score: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 0.65 + (topTwo[0] + topTwo[1]) / 2 * 0.35) };
  }).sort((a, b) => b.score - a.score);
}
