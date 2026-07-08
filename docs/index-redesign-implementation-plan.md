# Index Homepage Redesign Implementation Plan

## Objective

Redesign the `index.html` homepage into a dark premium professional landing page that strengthens Benjamin Grandmontagne's career credibility for recruiters and hiring managers.

The page should position Benjamin as a finance and risk professional who translates complex risk, regulatory, and transformation requirements into clear business processes, practical controls, and better decisions.

AI and technology should be present only as supporting evidence of practical technology fluency, not as the core identity.

## Target Audience

Primary audience:

- Recruiters
- Hiring managers
- Senior stakeholders evaluating Benjamin's professional profile

Secondary audience:

- Finance professionals
- Risk professionals
- Senior business professionals

## Positioning

Use third person throughout the page.

Core positioning:

> Benjamin Grandmontagne works at the intersection of finance, risk, regulation, and transformation — translating complex requirements into clear business processes, practical controls, and better ways of working.

Short hero positioning:

> Finance, risk, and transformation — translated into clearer processes, practical controls, and better decisions.

## Content Principles

Use an executive, polished, understated tone.

Avoid:

- Generic AI transformation language
- Startup-style enthusiasm
- Overclaiming
- Too much newsletter emphasis
- Making side projects feel like the main identity
- Mentioning nationality or location on the homepage
- Mentioning a current employer

Use:

- Clear business language
- Finance, risk, process, control, decision, execution, and transformation vocabulary
- Concise sections
- Third-person wording
- Strong but measured positioning

## Visual Direction

Move from the current warm beige/teal personal portfolio style to a dark premium finance aesthetic.

Design characteristics:

- Dark navy or near-black background
- Off-white or cream text
- Muted brass or gold accent
- Sharp dividers
- Restrained gradients
- More whitespace
- Editorial layout
- Fewer generic cards
- Senior, finance-oriented polish

The page should feel closer to a boutique strategy, risk, or finance advisory profile than a startup landing page.

## Required Files to Edit

Primary files:

- `index.html`
- `assets/css/main.css`

Do not change project links unless needed for visual consistency.

## Recommended Page Structure

### 1. Hero

Purpose: establish credibility immediately.

Include:

- `Benjamin Grandmontagne`
- Short positioning line
- One concise paragraph in third person
- Primary CTA linking to LinkedIn: `Connect on LinkedIn`

Suggested copy:

```text
Finance, risk, and transformation — translated into clearer processes, practical controls, and better decisions.
```

Supporting paragraph:

```text
Benjamin Grandmontagne works at the intersection of finance, risk, regulation, and transformation. His focus is on translating complex requirements into clear business processes, practical controls, and better ways of working.
```

Technology should not dominate the hero. It can appear in the supporting detail or later sections.

### 2. Professional Focus

Purpose: explain what Benjamin is credible for.

Recommended focus areas:

- Finance and risk judgment
- Regulatory translation
- Business process design
- Transformation and execution

Suggested framing:

```text
Benjamin's work is grounded in finance and risk discipline, with a focus on making complex requirements operational: clarifying decisions, designing processes, strengthening controls, and improving execution.
```

### 3. How Benjamin Works

Purpose: show operating style and seniority.

Recommended items:

- Structures complexity into usable decisions
- Turns requirements into business processes
- Builds practical controls and documentation
- Communicates across business and technical stakeholders
- Uses technology pragmatically where it improves execution

Avoid making this section sound like a generic skills list. It should describe working style and value.

### 4. Writing

Purpose: keep Capital & Complexity as a credibility signal, not the main CTA.

Keep the existing Substack link:

- `https://capitalcomplexity.substack.com/`

Suggested framing:

```text
Capital & Complexity is Benjamin's occasional writing project on finance, regulation, technology, and decision-making. It is used to clarify selected developments and their practical implications for professionals.
```

The newsletter should be visually secondary compared with the professional positioning and contact CTA.

### 5. Projects and Experiments

Purpose: show technical flair and curiosity without weakening career positioning.

Keep all current projects:

- AI Workflow Lab
- Capital Clues
- Meme Match

Recommended grouping:

- `Technical experiments`
  - AI Workflow Lab
  - Capital Clues
- `Hobby experiment`
  - Meme Match

Suggested framing for the whole section:

```text
Selected small projects and experiments showing practical curiosity, light technical fluency, and an interest in systems, interaction, and automation.
```

Frame `Meme Match` clearly as a hobby experiment so it does not dilute the senior professional positioning.

### 6. Contact

Purpose: make the main action clear.

Use LinkedIn as the only contact method.

Keep existing LinkedIn link:

- `https://www.linkedin.com/in/benjamin-grandmontagne-0a0674151`

Suggested CTA:

```text
For professional conversations, connect with Benjamin on LinkedIn.
```

## Navigation

Recommended navigation items:

- Profile
- Focus
- Writing
- Projects
- Contact

Keep navigation minimal and professional.

## SEO and Metadata

Update metadata to reflect the new positioning.

Suggested title:

```text
Benjamin Grandmontagne | Finance, Risk & Transformation
```

Suggested meta description:

```text
Benjamin Grandmontagne is a finance and risk professional focused on translating complex regulatory and transformation requirements into clear business processes, practical controls, and better decisions.
```

Update Open Graph and Twitter descriptions consistently.

## CSS Implementation Notes

### Color System

Suggested variables:

```css
--bg: #070b12;
--surface: #0f1623;
--surface-soft: #141d2b;
--text: #f4efe6;
--muted: #b8b0a3;
--subtle: #8f877b;
--line: rgba(244, 239, 230, 0.14);
--accent: #c7a66a;
--accent-strong: #e0c58a;
```

### Typography

Keep typography readable and restrained.

Recommended direction:

- Serif for hero headline if it looks premium
- Sans-serif for body text and navigation
- Large but controlled hero type
- Avoid overly decorative typography

### Layout

Recommended changes:

- Reduce generic card feel
- Use sharp section dividers
- Make hero feel more editorial and premium
- Use a strong dark background
- Use brass/gold accent sparingly
- Preserve responsive behavior on mobile

### Accessibility

Ensure:

- Strong text contrast on dark background
- Visible focus states
- Large enough tap targets on mobile
- No text hidden behind decorative effects
- Links are distinguishable beyond color where practical

## Acceptance Criteria

The redesign is successful when:

- The homepage immediately reads as a senior finance/risk professional profile
- The hero does not make AI the core identity
- The page uses third person consistently
- The CTA clearly points to LinkedIn contact
- Newsletter content is present but secondary
- All existing project links remain available
- Meme Match is framed as a hobby experiment
- The visual design is dark, premium, and finance-oriented
- The page remains fully responsive
- Metadata matches the new positioning

## Implementation Steps for Codex

1. Inspect current `index.html` and `assets/css/main.css`.
2. Rewrite homepage copy according to this plan.
3. Restructure sections only as much as needed to support the new hierarchy.
4. Redesign CSS variables and layout for the dark premium finance style.
5. Preserve existing external and internal links.
6. Check mobile responsiveness.
7. Validate basic HTML structure.
8. Summarize the changes and any assumptions made.

## Constraints

- Do not add heavy dependencies.
- Do not introduce a build system.
- Keep the site static and simple.
- Do not remove existing project pages.
- Do not mention nationality, location, or current employer.
- Do not make AI the main headline.
- Do not change repository structure beyond what is necessary for the redesign.
