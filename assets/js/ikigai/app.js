import { AREAS, ALL_QUESTIONS } from "./questions.js";
import { THEMES } from "./themes.js";
import { createSemanticVectors, MODEL_ID } from "./embeddings.js";
import { scoreAreas, findIntersections, topOverall } from "./scoring.js";
import { buildRecommendations } from "./recommendations.js";
import { loadAnswers, loadState, saveAnswers, saveState, resetUserData } from "./storage.js";

const elements = {
  questionnaire: document.querySelector("#questionnaire"),
  questionForm: document.querySelector("#question-form"),
  questionFields: document.querySelector("#question-fields"),
  stepNumber: document.querySelector("#step-number"),
  stepTitle: document.querySelector("#step-title"),
  stepPrompt: document.querySelector("#step-prompt"),
  progressLabel: document.querySelector("#progress-label"),
  progressBar: document.querySelector("#progress-bar"),
  progressSteps: document.querySelector("#progress-steps"),
  backButton: document.querySelector("#back-button"),
  nextButton: document.querySelector("#next-button"),
  formMessage: document.querySelector("#form-message"),
  loading: document.querySelector("#loading-panel"),
  loadingTitle: document.querySelector("#loading-title"),
  loadingCopy: document.querySelector("#loading-copy"),
  loadingBar: document.querySelector("#loading-bar"),
  loadingPercent: document.querySelector("#loading-percent"),
  errorPanel: document.querySelector("#error-panel"),
  errorMessage: document.querySelector("#error-message"),
  retryButton: document.querySelector("#retry-button"),
  results: document.querySelector("#results"),
  resultsContent: document.querySelector("#results-content"),
  editButton: document.querySelector("#edit-button"),
  resetButtons: document.querySelectorAll("[data-reset]")
};

let answers = loadAnswers();
const savedState = loadState();
let step = Number.isInteger(savedState.step) ? Math.min(Math.max(savedState.step, 0), AREAS.length - 1) : 0;
let lastAnalysis = null;

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[character]);
}

function setView(view) {
  elements.questionnaire.hidden = view !== "questionnaire";
  elements.loading.hidden = view !== "loading";
  elements.errorPanel.hidden = view !== "error";
  elements.results.hidden = view !== "results";
  document.body.dataset.view = view;
}

function renderProgress() {
  const progress = ((step + 1) / AREAS.length) * 100;
  elements.progressLabel.textContent = `Part ${step + 1} of ${AREAS.length}`;
  elements.progressBar.style.width = `${progress}%`;
  elements.progressBar.parentElement.setAttribute("aria-valuenow", String(step + 1));
  elements.progressSteps.innerHTML = AREAS.map((area, index) => `
    <li class="${index === step ? "is-current" : ""} ${index < step ? "is-complete" : ""}">
      <span>${area.number}</span>${escapeHTML(area.shortTitle)}
    </li>
  `).join("");
}

function renderStep({ focus = false } = {}) {
  const area = AREAS[step];
  elements.stepNumber.textContent = area.number;
  elements.stepTitle.textContent = area.title;
  elements.stepPrompt.textContent = area.prompt;
  elements.formMessage.textContent = "";
  elements.questionFields.innerHTML = "";

  area.questions.forEach((question, index) => {
    const group = document.createElement("div");
    group.className = "question-group";
    const label = document.createElement("label");
    label.htmlFor = question.id;
    label.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span>${escapeHTML(question.label)}`;
    const hint = document.createElement("p");
    hint.id = `${question.id}-hint`;
    hint.className = "field-hint";
    hint.textContent = question.hint;
    const textarea = document.createElement("textarea");
    textarea.id = question.id;
    textarea.name = question.id;
    textarea.rows = 3;
    textarea.value = answers[question.id] ?? "";
    textarea.setAttribute("aria-describedby", hint.id);
    textarea.placeholder = "Write a few honest sentences…";
    textarea.addEventListener("input", () => {
      answers[question.id] = textarea.value;
      saveAnswers(answers);
      elements.formMessage.textContent = "Saved locally";
      window.clearTimeout(textarea.dataset.messageTimer);
      textarea.dataset.messageTimer = window.setTimeout(() => { elements.formMessage.textContent = ""; }, 1200);
    });
    group.append(label, hint, textarea);
    elements.questionFields.append(group);
  });

  elements.backButton.disabled = step === 0;
  elements.nextButton.textContent = step === AREAS.length - 1 ? "Reveal my patterns" : "Next part";
  renderProgress();
  saveState({ step, complete: false });
  setView("questionnaire");
  if (focus) document.querySelector("#step-title").focus();
}

function areaHasAnswer(area) {
  return area.questions.some((question) => answers[question.id]?.trim());
}

function createAreaTexts() {
  return Object.fromEntries(AREAS.map((area) => [area.id, area.questions
    .filter((question) => answers[question.id]?.trim())
    .map((question) => `${question.label} ${answers[question.id].trim()}`)
    .join(" ")]));
}

function updateLoading({ message, percent }) {
  elements.loadingCopy.textContent = message;
  if (Number.isFinite(percent)) {
    elements.loadingBar.style.width = `${percent}%`;
    elements.loadingPercent.textContent = `${percent}%`;
  } else {
    elements.loadingBar.style.width = "28%";
    elements.loadingPercent.textContent = "";
  }
}

function themePill(theme, includeScore = true) {
  return `<li><span>${escapeHTML(theme.label)}</span>${includeScore ? `<strong>${theme.score ?? theme.relevance}</strong>` : ""}</li>`;
}

function renderResults(byArea, intersections, overall, recommendations) {
  const leadThemes = overall.slice(0, 5);
  const intersectionThemes = intersections.slice(0, 8);
  const centerTheme = intersectionThemes[0] ?? leadThemes[0];

  elements.resultsContent.innerHTML = `
    <section class="result-hero" aria-labelledby="results-title">
      <p class="eyebrow">Your reflection</p>
      <h1 id="results-title" tabindex="-1">Patterns worth exploring</h1>
      <p>Your answers point toward recurring themes—not a single predetermined purpose. Use these results as prompts for experiments, conversations and choices.</p>
      <ul class="top-theme-list" aria-label="Top themes">${leadThemes.map((theme) => themePill(theme)).join("")}</ul>
    </section>

    <section class="result-section" aria-labelledby="map-title">
      <div class="result-heading">
        <p class="eyebrow">Your Ikigai map</p>
        <h2 id="map-title">Where the four perspectives meet</h2>
      </div>
      <div class="ikigai-map" role="img" aria-label="Four overlapping Ikigai areas around ${escapeHTML(centerTheme.label)}">
        <div class="ikigai-circle circle-love"><span>What you love</span></div>
        <div class="ikigai-circle circle-good"><span>What you are good at</span></div>
        <div class="ikigai-circle circle-needs"><span>What the world needs</span></div>
        <div class="ikigai-circle circle-paid"><span>What people may pay for</span></div>
        <div class="ikigai-center"><small>Strongest overlap</small><strong>${escapeHTML(centerTheme.label)}</strong></div>
      </div>
    </section>

    <section class="result-section" aria-labelledby="areas-title">
      <div class="result-heading">
        <p class="eyebrow">Four lenses</p>
        <h2 id="areas-title">Strong themes in each area</h2>
      </div>
      <div class="area-results">
        ${AREAS.map((area) => `
          <article class="area-result area-${area.id}">
            <p class="area-number">${area.number}</p>
            <h3>${escapeHTML(area.title)}</h3>
            <ol>
              ${byArea[area.id].slice(0, 5).map((theme) => `
                <li>
                  <div><span>${escapeHTML(theme.label)}</span><strong>${theme.score}</strong></div>
                  <div class="score-track" aria-label="${escapeHTML(theme.label)} relative relevance ${theme.score} out of 100"><span style="width:${theme.score}%"></span></div>
                </li>`).join("")}
            </ol>
          </article>`).join("")}
      </div>
      <p class="score-note">Scores show relative similarity within your own answers. They are not personality measurements and should not be compared between people.</p>
    </section>

    <section class="result-section intersection-section" aria-labelledby="intersections-title">
      <div class="result-heading">
        <p class="eyebrow">Intersections</p>
        <h2 id="intersections-title">Themes appearing across several areas</h2>
        <p>These may be especially useful starting points because they connect more than one part of the picture.</p>
      </div>
      ${intersectionThemes.length ? `<ul class="intersection-list">${intersectionThemes.map((theme) => `
        <li>
          <div><strong>${escapeHTML(theme.label)}</strong><span>${theme.relevance} relevance</span></div>
          <p>Appears strongly in ${theme.strongAreas.map((id) => AREAS.find((area) => area.id === id).shortTitle.toLowerCase()).join(", ")}.</p>
        </li>`).join("")}</ul>` : `<p class="empty-result">No broad intersection dominated—and that can be useful. Your four areas may currently point to distinct parts of life rather than one combined direction.</p>`}
    </section>

    <section class="result-section" aria-labelledby="directions-title">
      <div class="result-heading">
        <p class="eyebrow">Possible directions</p>
        <h2 id="directions-title">Small paths to test</h2>
        <p>These are deterministic combinations of your strongest themes, not AI-generated advice. Treat each as a hypothesis.</p>
      </div>
      <div class="direction-list">
        ${recommendations.map((recommendation, index) => `
          <article>
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div><h3>${escapeHTML(recommendation.title)}</h3><p>${escapeHTML(recommendation.explanation)}</p></div>
          </article>`).join("")}
      </div>
    </section>
  `;
  elements.resultsContent.querySelector("#results-title").focus();
}

async function analyse() {
  setView("loading");
  elements.loadingTitle.textContent = "Finding patterns in your answers";
  elements.loadingBar.style.width = "0%";
  elements.loadingPercent.textContent = "";
  try {
    const { areaVectors, themeVectors } = await createSemanticVectors(createAreaTexts(), THEMES, updateLoading);
    const byArea = scoreAreas(areaVectors, themeVectors, THEMES);
    const intersections = findIntersections(byArea, THEMES);
    const overall = topOverall(byArea, THEMES);
    const recommendations = buildRecommendations(byArea, intersections);
    lastAnalysis = { byArea, intersections, overall, recommendations };
    renderResults(byArea, intersections, overall, recommendations);
    saveState({ step: AREAS.length - 1, complete: true });
    setView("results");
  } catch (error) {
    console.error(error);
    elements.errorMessage.textContent = navigator.onLine
      ? "The local analysis model could not be loaded. This may be a temporary browser, memory or download issue. Your answers are safe—try again in a moment."
      : "You appear to be offline. The model needs an internet connection for its first download; after that, your browser can usually reuse its cached files.";
    setView("error");
    elements.retryButton.focus();
  }
}

elements.questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const area = AREAS[step];
  if (!areaHasAnswer(area)) {
    elements.formMessage.textContent = "Add at least one answer before continuing.";
    elements.questionFields.querySelector("textarea").focus();
    return;
  }
  if (step < AREAS.length - 1) {
    step += 1;
    renderStep({ focus: true });
  } else {
    analyse();
  }
});

elements.backButton.addEventListener("click", () => {
  if (step > 0) {
    step -= 1;
    renderStep({ focus: true });
  }
});

elements.editButton.addEventListener("click", () => {
  step = 0;
  renderStep({ focus: true });
});

elements.retryButton.addEventListener("click", analyse);

elements.resetButtons.forEach((button) => button.addEventListener("click", () => {
  if (!window.confirm("Delete all your Ikigai answers and start again? This cannot be undone.")) return;
  resetUserData();
  answers = {};
  lastAnalysis = null;
  step = 0;
  renderStep({ focus: true });
}));

document.querySelector("#model-name").textContent = MODEL_ID;

if (savedState.complete && ALL_QUESTIONS.some((question) => answers[question.id]?.trim())) {
  analyse();
} else {
  renderStep();
}
