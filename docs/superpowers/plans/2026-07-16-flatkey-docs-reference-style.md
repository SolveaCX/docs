# Flatkey Docs Reference Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing bilingual Mintlify documentation so it matches the approved Flatkey reference-page visual language without changing content, routes, features, or release configuration.

**Architecture:** Keep Mintlify Luma and its native navigation, search, language, theme, AI, and API-reference behavior. Put supported brand settings in `docs.json`, provide small SVG brand assets, and use one root-level stylesheet built only on Mintlify's documented stable IDs, custom elements, state attributes, and standard media queries. A dependency-free Node regression test locks the configuration, assets, stylesheet contract, and all 56 navigation routes.

**Tech Stack:** Mintlify Luma, JSON, CSS, SVG, Node.js built-in modules, OpenCLI Browser Bridge

---

### Task 1: Lock the visual and routing contract

**Files:**
- Create: `tests/validate-reference-style.mjs`
- Test: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Write the failing static regression test**

Create a dependency-free Node script that:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const config = JSON.parse(read("docs.json"));
const css = existsSync(resolve(root, "style.css")) ? read("style.css") : "";

assert.deepEqual(config.colors, {
  primary: "#5B21B6",
  light: "#7C3AED",
  dark: "#7C3AED",
});
assert.deepEqual(config.fonts, {
  heading: { family: "Public Sans" },
  body: { family: "Public Sans" },
});
assert.deepEqual(config.logo, {
  light: "/logo/light.svg",
  dark: "/logo/dark.svg",
});
assert.equal(config.favicon, "/favicon.svg");
assert.deepEqual(config.appearance, { default: "system", strict: false });
assert.equal(config.styling.codeblocks, "dark");

const navigationPages = config.navigation.languages.flatMap((language) =>
  language.tabs.flatMap((tab) => tab.groups.flatMap((group) => group.pages)),
);
assert.equal(navigationPages.length, 54);
const pages = ["index", "zh/index", ...navigationPages];
assert.equal(pages.length, 56);
assert.equal(new Set(pages).size, 56);
for (const page of pages) assert.ok(existsSync(resolve(root, `${page}.mdx`)), page);

for (const selector of [
  "#navbar",
  "#sidebar-content",
  "#body-content",
  "#content-area",
  "#page-title",
  "#table-of-contents",
  "nav-logo",
  "sidebar-group-header",
  "code-block",
  "card",
  "callout",
]) assert.match(css, new RegExp(selector.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")));

for (const token of [
  "#5B21B6",
  "#7C3AED",
  "#F0EBFA",
  "#0B0B0F",
  "#0A0A10",
  "#12121A",
  "#F5F5F2",
  "#A7F3C8",
  "Public Sans",
  "JetBrains Mono",
]) assert.ok(css.includes(token), token);

for (const path of ["logo/light.svg", "logo/dark.svg", "favicon.svg"]) {
  const svg = read(path);
  assert.match(svg, /^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.ok(svg.includes("#5B21B6"), path);
}

for (const logo of ["logo/light.svg", "logo/dark.svg"]) {
  const svg = read(logo);
  assert.ok(svg.includes("flatkey"), logo);
  assert.ok(svg.includes("DOCS"), logo);
}

assert.doesNotMatch(css, /\.bg-|\.text-|\.dark\\:|\\[class[\\^*$|~]?=/);
console.log("Reference style contract validated for 56 routes.");
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node tests/validate-reference-style.mjs`

Expected: FAIL at `config.colors` because the existing orange palette does not match the approved purple palette (and `style.css` does not yet exist).

- [ ] **Step 3: Commit the regression contract**

```powershell
git add tests/validate-reference-style.mjs
git commit -m "Lock the approved Flatkey visual contract before restyling" -m "Constraint: Preserve all 56 bilingual routes and Mintlify-native behavior`nRejected: Screenshot-only acceptance | it cannot guard route or configuration regressions`nConfidence: high`nScope-risk: narrow`nTested: node tests/validate-reference-style.mjs fails on the existing orange palette`nNot-tested: Browser rendering remains pending until implementation"
```

### Task 2: Apply supported Mintlify appearance settings

**Files:**
- Modify: `docs.json`
- Test: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Replace only the root appearance fields**

Keep `navigation` byte-for-byte equivalent while setting:

```json
"colors": {
  "primary": "#5B21B6",
  "light": "#7C3AED",
  "dark": "#7C3AED"
},
"fonts": {
  "heading": { "family": "Public Sans" },
  "body": { "family": "Public Sans" }
},
"logo": {
  "light": "/logo/light.svg",
  "dark": "/logo/dark.svg"
},
"favicon": "/favicon.svg",
"appearance": {
  "default": "system",
  "strict": false
},
"styling": {
  "codeblocks": "dark"
}
```

- [ ] **Step 2: Confirm the test advances to the missing stylesheet**

Run: `node tests/validate-reference-style.mjs`

Expected: FAIL when required selectors are absent because `style.css` has not been created.

- [ ] **Step 3: Confirm navigation was not changed**

Run a Node comparison that removes only `colors`, `fonts`, `logo`, `favicon`, `appearance`, and `styling` from the working config and confirms the remaining object equals `HEAD:docs.json`.

Expected: `navigation-preserved`.

### Task 3: Replace placeholder brand assets

**Files:**
- Modify: `logo/light.svg`
- Modify: `logo/dark.svg`
- Modify: `favicon.svg`
- Test: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Create the light wordmark**

Use a compact `188 × 28` SVG containing the approved violet pixel mark, lowercase `flatkey` in Public Sans, and `DOCS` in JetBrains Mono. Set light-mode wordmark text to `#0B0B0F` and keep the file free of scripts, embedded images, and external references.

- [ ] **Step 2: Create the dark wordmark**

Reuse the same geometry and violet icon; set the lowercase wordmark to `#F5F5F2` and `DOCS` to `#B9B9C5`.

- [ ] **Step 3: Create the favicon**

Use a square `32 × 32` SVG with the same pixel mark in `#5B21B6` and `#7C3AED`, without text.

- [ ] **Step 4: Run the test and verify assets pass**

Run: `node tests/validate-reference-style.mjs`

Expected: the asset assertions pass; the test still fails on missing stylesheet selectors/tokens.

### Task 4: Implement the reference-page visual system

**Files:**
- Create: `style.css`
- Test: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Define scoped design tokens and typography**

In `style.css`, define light tokens on `:root`, dark tokens on `.dark`, the Public Sans body stack, and JetBrains Mono for `code`, `pre`, `kbd`, `samp`, `code-block`, `sidebar-group-header`, and `#table-of-contents` headings.

- [ ] **Step 2: Style the shell with stable Mintlify hooks**

Implement the 64px navbar, 260px desktop sidebar, low-contrast borders, responsive content padding, readable line length, and compact TOC using `#navbar`, `#sidebar-content`, `#body-content`, `#content-area`, `#content`, and `#table-of-contents`.

- [ ] **Step 3: Style navigation states and controls**

Use violet active/current/focus states for `nav-tabs-item`, sidebar `data-active`/`data-current-path` items, `toc-item`, links, and `#topbar-cta-button`; preserve language, search, theme, AI, and mobile-menu controls.

- [ ] **Step 4: Style content and API components**

Apply the approved radius, borders, surfaces, and spacing to `card`, `callout`, `tabs`, `step`, `frame`, `code-block`, tables, inputs, buttons, and documented API-reference custom elements without altering DOM structure.

- [ ] **Step 5: Keep code surfaces dark in both themes**

Set `code-block`, `pre`, and their toolbars to `#0A0A10`/`#12121A`, JetBrains Mono, light foreground text, and `#A7F3C8` accents while preventing horizontal page overflow.

- [ ] **Step 6: Add responsive and accessibility rules**

At desktop sizes apply the reference density; below Mintlify's mobile breakpoint restore single-column padding, 44px minimum interactive targets, compact wordmark sizing, overflow-safe tables/code, visible `:focus-visible`, and reduced-motion behavior.

- [ ] **Step 7: Run the static test and verify GREEN**

Run: `node tests/validate-reference-style.mjs`

Expected: PASS with `Reference style contract validated for 56 routes.`

- [ ] **Step 8: Run repository-level checks**

Run:

```powershell
git diff --check
git status --short
git diff --name-only origin/main
```

Expected: no whitespace errors; only design/plan, test, root configuration, root stylesheet, and three SVG assets differ; no `.mdx` files differ.

- [ ] **Step 9: Commit the implementation**

```powershell
git add docs.json style.css logo/light.svg logo/dark.svg favicon.svg
git commit -m "Align the docs shell with Flatkey's established visual language" -m "Constraint: Keep Mintlify Luma, all bilingual routes, and native controls intact`nRejected: Rebuilding the docs as a custom single page | it would remove maintained Mintlify capabilities`nConfidence: high`nScope-risk: moderate`nDirective: Keep future style overrides on documented Mintlify hooks; do not bind generated utility classes`nTested: node tests/validate-reference-style.mjs; git diff --check`nNot-tested: Draft Preview browser matrix remains pending"
```

### Task 5: Preview and visual verification

**Files:**
- Modify only if evidence requires: `style.css`, `docs.json`, `logo/light.svg`, `logo/dark.svg`, `favicon.svg`
- Test: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Push only the feature branch**

Run: `git push -u origin feature/docs-reference-style`

Expected: remote feature branch updates; `main` is untouched and Mintlify creates a Draft Preview.

- [ ] **Step 2: Open the Draft Preview with OpenCLI Browser Bridge**

Use the connected Chrome profile. Do not read cookies or web storage. Wait for the preview deployment to finish, then capture the preview URL.

- [ ] **Step 3: Verify the desktop matrix at 1440 × 900**

Inspect light and dark mode for English and Chinese on Quickstart, Codex Desktop, a concept page, and API Reference. Confirm the wordmark, purple system, 64px header, compact sidebar, readable content, TOC, cards, controls, and always-dark code blocks.

- [ ] **Step 4: Verify the mobile matrix at 390 × 844**

Confirm the menu, search, language switcher, theme switcher, brand sizing, touch targets, content wrapping, and code/table overflow. Confirm no page-level horizontal scroll.

- [ ] **Step 5: Verify behavior and routes**

Confirm English/Chinese switching is bidirectional, search opens, theme selection survives reload, API controls remain usable, all 56 configured routes return without 404, and the browser console has zero errors caused by this change.

- [ ] **Step 6: Iterate only from concrete visual evidence**

For each mismatch, save a screenshot, identify the stable selector and expected token/geometry, make the smallest CSS/SVG/config edit, rerun the static test, and repeat the affected viewport/theme/language check.

- [ ] **Step 7: Final verification and handoff**

Run:

```powershell
node tests/validate-reference-style.mjs
git diff --check
git status --short --branch
git diff --name-only origin/main
```

Expected: all checks pass, no `.mdx` or release-configuration files changed, screenshots cover the matrix, and the branch is ready for a `main`-targeted PR after user preview acceptance.
