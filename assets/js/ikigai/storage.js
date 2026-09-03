const ANSWERS_KEY = "ikigai-creator:answers:v1";
const STATE_KEY = "ikigai-creator:state:v1";
const EMBEDDINGS_KEY = "ikigai-creator:theme-embeddings:v1";

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function loadAnswers() {
  const answers = readJSON(ANSWERS_KEY, {});
  return answers && typeof answers === "object" ? answers : {};
}

export function saveAnswers(answers) {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadState() {
  return readJSON(STATE_KEY, { step: 0, complete: false });
}

export function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function loadThemeEmbeddingCache(version) {
  const cached = readJSON(EMBEDDINGS_KEY, null);
  return cached?.version === version && Array.isArray(cached.vectors) ? cached.vectors : null;
}

export function saveThemeEmbeddingCache(version, vectors) {
  try {
    localStorage.setItem(EMBEDDINGS_KEY, JSON.stringify({ version, vectors }));
  } catch {
    // Answers are more important than this optional performance cache.
  }
}

export function resetUserData() {
  localStorage.removeItem(ANSWERS_KEY);
  localStorage.removeItem(STATE_KEY);
}
