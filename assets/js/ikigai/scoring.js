const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

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

export function scoreAreas(areaVectors, themeVectors, themes) {
  const byArea = {};
  for (const [areaId, vector] of Object.entries(areaVectors)) {
    byArea[areaId] = themes
      .map((theme, index) => ({ ...theme, rawScore: cosineSimilarity(vector, themeVectors[index]) }))
      .sort((a, b) => b.rawScore - a.rawScore);

    const scores = byArea[areaId].map((item) => item.rawScore);
    const floor = Math.min(...scores);
    const ceiling = Math.max(...scores);
    const range = ceiling - floor || 1;
    byArea[areaId] = byArea[areaId].map((item) => ({
      ...item,
      score: Math.round(clamp((item.rawScore - floor) / range, 0, 1) * 100)
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
