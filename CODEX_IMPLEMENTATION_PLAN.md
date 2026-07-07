# Codex Implementation Plan — Public GitHub Pages Repo

## Goal

Improve this public GitHub Pages repository so it looks more professional, is easier to maintain, and better supports Benjamin Grandmontagne's public positioning around finance, AI, transformation, regulation, and practical decision systems.

The site should remain simple, static, fast, and free to host on GitHub Pages.

## Repository context

This repository currently powers the personal website at:

- <https://bengrnd.github.io>

Current visible structure includes:

- `index.html` — main personal website page.
- `CapitalClues.html` — small browser game project.
- `meme.html` — small browser game project.
- `README.md` — minimal repository description.

The implementation should preserve the current visual identity unless a change is clearly needed for readability, accessibility, or maintainability.

## Core constraints

- Do not add a paid service.
- Do not introduce a heavy framework unless there is a strong reason.
- Prefer plain HTML, CSS, and vanilla JavaScript.
- Keep the site deployable through GitHub Pages.
- Do not expose private or employer-confidential information.
- Keep professional wording neutral and public-safe.
- Avoid making unsupported claims about professional credentials, employer work, internal projects, or confidential banking topics.
- Make small, reviewable commits or a single clean PR.

## Recommended implementation order

### Phase 1 — Repository polish

#### 1. Rewrite `README.md`

Replace the minimal README with a more useful public-facing description.

Include:

- project title;
- live site URL;
- short purpose of the website;
- main sections;
- listed projects;
- local development instructions;
- contact link;
- license note.

Suggested README structure:

```md
# Benjamin Grandmontagne — Personal Website

Personal website for public writing, projects, and experiments around finance, AI, transformation, regulation, and practical decision systems.

## Live site

https://bengrnd.github.io

## Main sections

- Professional focus
- Capital & Complexity newsletter
- Projects and experiments
- Contact

## Projects

- Capital Clues — browser game about guessing world capitals from structured clues.
- Meme Match — browser game about matching memes with cultural context.

## Local development

Open `index.html` directly in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Contact

LinkedIn: https://www.linkedin.com/in/benjamin-grandmontagne-0a0674151
```

Acceptance criteria:

- README explains what the repo is.
- README links to the live site.
- README does not overstate the scope of the project.

#### 2. Add basic repository files

Add:

- `.editorconfig`
- `.gitignore`
- `LICENSE`
- `robots.txt`
- `sitemap.xml`
- `404.html`

Use simple defaults.

For the license, choose a standard permissive license only if appropriate. If uncertain, add a conservative `LICENSE` note such as:

```txt
Copyright (c) Benjamin Grandmontagne. All rights reserved.

This repository contains the source code and content for a personal website.
No reuse is permitted without permission unless stated otherwise in a specific file.
```

Acceptance criteria:

- Basic repo hygiene files exist.
- `sitemap.xml` references the live homepage and main project pages.
- `robots.txt` points to the sitemap.
- `404.html` provides a simple navigation path back to the homepage.

### Phase 2 — SEO, sharing, and public positioning

#### 3. Add metadata to `index.html`

In the `<head>` of `index.html`, add:

- meta description;
- canonical URL;
- Open Graph metadata;
- Twitter/X card metadata;
- theme color;
- favicon placeholder if no favicon exists.

Recommended content:

```html
<meta name="description" content="Benjamin Grandmontagne — finance professional focused on AI, transformation, regulation, and practical decision systems.">
<link rel="canonical" href="https://bengrnd.github.io/">
<meta property="og:title" content="Benjamin Grandmontagne">
<meta property="og:description" content="Finance, AI, transformation, regulation, and practical decision systems.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://bengrnd.github.io/">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Benjamin Grandmontagne">
<meta name="twitter:description" content="Finance, AI, transformation, regulation, and practical decision systems.">
<meta name="theme-color" content="#155e63">
```

Acceptance criteria:

- Homepage has a clear search/social description.
- Metadata is not misleading.
- No broken image metadata is added unless an actual image exists.

#### 4. Sharpen homepage copy

Improve the hero and intro wording while keeping the tone professional and restrained.

Suggested hero subtitle:

```txt
Finance professional focused on turning complexity in AI, regulation, and transformation into clear decisions, practical systems, and better ways of working.
```

Suggested intro:

```txt
I write and build around the practical side of complex work: decision systems, AI-enabled workflows, regulatory change, and the habits that help teams move with more clarity.
```

Acceptance criteria:

- Copy is clearer and more distinctive.
- Wording remains public-safe and does not imply confidential employer work.
- The page still reads as a professional personal site, not a sales page.

#### 5. Improve calls to action

Update CTA wording:

- `Read Capital Complexity on Substack` → `Subscribe to Capital & Complexity` or `Read Capital & Complexity`.
- LinkedIn contact section should use a stronger but still neutral CTA, e.g. `Connect on LinkedIn`.
- Project cards should use clear links: `Play`, `View project`, or `Read more`.

Acceptance criteria:

- Each major section has one clear next action.
- CTAs are concise.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.

### Phase 3 — Maintainability

#### 6. Extract shared CSS

Move shared homepage CSS from inline `<style>` into:

```txt
assets/css/main.css
```

Then update `index.html`:

```html
<link rel="stylesheet" href="assets/css/main.css">
```

Do not attempt a full design rewrite.

Acceptance criteria:

- `index.html` becomes easier to read.
- Styling remains visually equivalent or very close.
- No layout regressions on mobile.

#### 7. Normalize project page structure

Review `CapitalClues.html` and `meme.html`.

For each project page, ensure it has:

- proper `<title>`;
- meta description;
- link back to homepage;
- responsive layout;
- accessible buttons and form controls;
- no console errors;
- no hard dependency on unavailable external services unless handled gracefully.

Acceptance criteria:

- Both project pages remain playable.
- Both project pages can be reached from the homepage.
- Both project pages can navigate back to the homepage.
- Browser console has no obvious runtime errors on initial load.

### Phase 4 — Accessibility and quality

#### 8. Add accessibility improvements

Add or verify:

- skip link to main content;
- `aria-current="page"` where useful;
- accessible labels for interactive controls;
- visible focus states;
- reduced-motion handling is preserved;
- adequate color contrast.

Acceptance criteria:

- Keyboard navigation works on the homepage and games.
- Focus states are visible.
- Main content can be reached without tabbing through every nav item.

#### 9. Add lightweight validation workflow

Add a GitHub Actions workflow:

```txt
.github/workflows/validate-site.yml
```

Preferred checks:

- run on push and pull request;
- validate HTML if a lightweight validator is feasible;
- check broken internal links if feasible;
- avoid large dependency installs;
- keep logs readable.

Possible tools:

- `html-validate`
- `linkinator`
- or a small custom script if simpler.

Acceptance criteria:

- Workflow runs on PRs and pushes to `main`.
- It fails on obvious HTML/link errors.
- It remains lightweight and free.

### Phase 5 — Optional improvements

Only implement these if the core work is already complete and low risk.

#### 10. Add a simple projects index

Create:

```txt
projects.html
```

Purpose:

- list small experiments;
- explain what each demonstrates;
- link to live pages and source files.

Acceptance criteria:

- Homepage can link to `projects.html`.
- Page does not duplicate too much homepage content.

#### 11. Add selected writing links

Add a small section linking to selected Capital & Complexity articles.

Constraints:

- Use stable public URLs only.
- Do not scrape Substack.
- Keep it manually maintained.

Acceptance criteria:

- Section exists only if there are stable article links.
- Links open correctly.

## Suggested branch and PR

Use a branch name like:

```txt
agent/public-site-polish
```

Suggested PR title:

```txt
Polish public GitHub Pages site
```

Suggested PR body:

```md
## Summary

- Improved repository documentation and basic site metadata.
- Clarified homepage positioning and calls to action.
- Added basic site hygiene files.
- Improved maintainability and accessibility where practical.

## Validation

- Opened `index.html` locally.
- Checked navigation links.
- Checked project pages still load.
- Ran available validation workflow or documented why not available.
```

## Non-goals

Do not do the following in this implementation:

- migrate to React, Next.js, Astro, or another framework;
- add analytics unless explicitly requested;
- redesign the full site from scratch;
- add employer-specific details;
- create exaggerated personal branding copy;
- add paid services;
- make private side projects public without explicit confirmation.

## Final acceptance checklist

- [ ] README is useful and public-facing.
- [ ] Homepage has SEO/social metadata.
- [ ] Homepage copy is sharper but still neutral.
- [ ] CTAs are clearer.
- [ ] Project links work.
- [ ] Basic repo files exist.
- [ ] CSS is easier to maintain, if extracted.
- [ ] Accessibility basics are improved.
- [ ] Validation workflow exists, or a clear reason is documented if skipped.
- [ ] No private or employer-confidential information is introduced.
