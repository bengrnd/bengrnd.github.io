import { THEME_VERSION } from "./themes.js?v=2";
import { loadThemeEmbeddingCache, saveThemeEmbeddingCache } from "./storage.js";

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const CACHE_VERSION = `${THEME_VERSION}:${MODEL_ID}:int8`;
const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm";
let extractorPromise;

function progressMessage(event) {
  if (event.status === "progress" && Number.isFinite(event.progress)) {
    return { message: `Downloading ${event.file ?? "model files"}`, percent: Math.round(event.progress) };
  }
  const messages = {
    initiate: "Preparing model files",
    download: "Starting model download",
    done: "Model file ready",
    ready: "Semantic model ready"
  };
  return { message: messages[event.status] ?? "Preparing local analysis", percent: null };
}

async function getExtractor(onProgress = () => {}) {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      onProgress({ message: "Loading the analysis library", percent: null });
      const { env, pipeline } = await import(TRANSFORMERS_URL);
      env.allowLocalModels = false;
      return pipeline("feature-extraction", MODEL_ID, {
        dtype: "int8",
        progress_callback: (event) => onProgress(progressMessage(event))
      });
    })().catch((error) => {
      extractorPromise = undefined;
      throw error;
    });
  }
  return extractorPromise;
}

async function embed(extractor, texts, onProgress, label) {
  const vectors = [];
  for (let i = 0; i < texts.length; i += 1) {
    onProgress({ message: `${label} ${i + 1} of ${texts.length}`, percent: Math.round((i / texts.length) * 100) });
    const output = await extractor(texts[i], { pooling: "mean", normalize: true });
    vectors.push(Array.from(output.data));
  }
  return vectors;
}

export async function createSemanticVectors(areaTexts, themes, onProgress = () => {}) {
  const extractor = await getExtractor(onProgress);
  let themeVectors = loadThemeEmbeddingCache(CACHE_VERSION);

  if (!themeVectors || themeVectors.length !== themes.length) {
    themeVectors = await embed(
      extractor,
      themes.map((theme) => `${theme.label}. ${theme.description}`),
      onProgress,
      "Learning theme"
    );
    saveThemeEmbeddingCache(CACHE_VERSION, themeVectors);
  } else {
    onProgress({ message: "Using cached theme patterns", percent: 100 });
  }

  const entries = Object.entries(areaTexts);
  const areaResults = await embed(
    extractor,
    entries.map(([, text]) => text),
    onProgress,
    "Analysing area"
  );
  return {
    themeVectors,
    areaVectors: Object.fromEntries(entries.map(([areaId], index) => [areaId, areaResults[index]]))
  };
}

export { MODEL_ID };
