const PATHS = [
  { id: "creator", needs: ["creativity", "writing", "storytelling", "design", "making"], title: "Create and publish useful work", format: "Turn your perspective into {theme} projects—such as guides, stories, tools or a focused publication." },
  { id: "educator", needs: ["teaching", "learning", "communication", "mentoring", "languages"], title: "Teach what you are learning", format: "Combine {theme} with clear teaching through a course, workshop, learning product or mentoring practice." },
  { id: "builder", needs: ["technology", "problem_solving", "innovation", "making", "design"], title: "Build a practical digital solution", format: "Use {theme} to solve a narrow, recurring problem with a small tool, product or automation." },
  { id: "advisor", needs: ["analysis", "strategy", "research", "communication", "risk"], title: "Guide better decisions", format: "Apply {theme} to research, advisory work or decision tools that make complex choices clearer." },
  { id: "leader", needs: ["leadership", "collaboration", "facilitation", "organization", "operations"], title: "Lead meaningful improvement", format: "Bring {theme} into a team or organisation that needs clearer direction, coordination and change." },
  { id: "founder", needs: ["entrepreneurship", "independence", "innovation", "strategy", "finance"], title: "Test a small independent venture", format: "Explore {theme} through a low-risk service or product experiment for a specific audience." },
  { id: "community", needs: ["community", "helping", "care", "hospitality", "facilitation"], title: "Create a supportive community", format: "Use {theme} to convene, support or connect people around a shared need or transition." },
  { id: "impact", needs: ["justice", "sustainability", "health", "helping", "research"], title: "Work on a mission that matters to you", format: "Pair {theme} with evidence and practical action in a cause-led organisation, initiative or project." },
  { id: "explorer", needs: ["curiosity", "adventure", "nature", "culture", "languages"], title: "Turn exploration into shared value", format: "Develop {theme} through field research, cultural work, experiences or content that helps others discover." },
  { id: "specialist", needs: ["craftsmanship", "data", "finance", "negotiation", "operations"], title: "Deepen a valuable specialty", format: "Build uncommon expertise at the intersection of {theme}, then package it as a role, service or resource." }
];

export function buildRecommendations(byArea, intersections, limit = 5) {
  const areaIds = Object.keys(byArea);
  const scoreByTheme = new Map();
  for (const areaId of areaIds) {
    for (const item of byArea[areaId]) {
      scoreByTheme.set(item.id, (scoreByTheme.get(item.id) ?? 0) + item.score / areaIds.length);
    }
  }
  for (const item of intersections) {
    scoreByTheme.set(item.id, (scoreByTheme.get(item.id) ?? 0) + item.relevance * 0.35);
  }

  return PATHS.map((path) => {
    const matches = path.needs
      .map((id) => ({ id, score: scoreByTheme.get(id) ?? 0 }))
      .sort((a, b) => b.score - a.score);
    const score = matches.slice(0, 3).reduce((sum, item) => sum + item.score, 0);
    const labels = matches.slice(0, 2).map((match) => {
      for (const areaId of areaIds) {
        const found = byArea[areaId].find((item) => item.id === match.id);
        if (found) return found.label.toLowerCase();
      }
      return match.id.replaceAll("_", " ");
    });
    return {
      ...path,
      score,
      themes: labels,
      explanation: path.format.replace("{theme}", labels.join(" and "))
    };
  }).sort((a, b) => b.score - a.score).slice(0, limit);
}
