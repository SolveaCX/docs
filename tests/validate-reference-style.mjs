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
assert.equal(navigationPages.length, 56);
const pages = ["index", "zh/index", ...navigationPages];
assert.equal(pages.length, 58);
assert.equal(new Set(pages).size, 58);
for (const page of pages) {
  assert.ok(existsSync(resolve(root, `${page}.mdx`)), page);
}

for (const path of ["logo/light.svg", "logo/dark.svg", "favicon.svg"]) {
  const svg = read(path);
  assert.match(svg, /^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.ok(svg.includes("#A855F7"), path);
  assert.ok(svg.includes("#6D28D9"), path);
  assert.ok(svg.includes("M32 5.5C39 8.5"), path);
  assert.ok(svg.includes('cx="32" cy="22.5"'), path);
}

for (const logo of ["logo/light.svg", "logo/dark.svg"]) {
  const svg = read(logo);
  assert.ok(svg.includes("flatkey"), logo);
  assert.ok(!svg.includes("DOCS"), logo);
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cssRules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/gs)].flatMap(
  ([, selectorList, declarations]) =>
    selectorList
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split(",")
      .map((selector) => ({ selector: selector.trim(), declarations })),
);
const assertDeclaration = (selector, property, value) => {
  const rules = cssRules.filter((rule) => rule.selector === selector);
  assert.ok(rules.length > 0, `Missing CSS rule for ${selector}`);
  assert.ok(
    rules.some((rule) =>
      new RegExp(
        `${escapeRegex(property)}:\\s*${escapeRegex(value)}(?:\\s*;|\\s*$)`,
      ).test(rule.declarations),
    ),
    `${selector} must set ${property}: ${value}`,
  );
};
for (const selector of [
  "#navbar",
  "#sidebar-content",
  "#body-content",
  "#content-area",
  "#page-title",
  "#table-of-contents",
  "nav-logo",
  ".nav-logo",
  "sidebar-group-header",
  ".sidebar-group-header",
  "toc-item",
  ".toc-item",
  "card",
  ".card",
  "callout",
  ".callout",
  "code-block",
  "[data-component-part=\"code-block-root\"]",
  "[data-component-part=\"code-group-tab-bar\"]",
]) {
  assert.match(css, new RegExp(escapeRegex(selector)));
}

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
]) {
  assert.ok(css.includes(token), token);
}

assert.doesNotMatch(css, /\.bg-|\.text-|\.dark\:|\[class[\^*$|~]?=/);
assertDeclaration(
  '#content .code-group [role="tab"][aria-selected="true"]',
  "background",
  "#F5F5F2",
);
assertDeclaration(
  '#content [data-component-part="code-group-tab-bar"] [role="tab"][aria-selected="true"]',
  "background",
  "#F5F5F2",
);
assertDeclaration(
  '#content .code-group [data-testid="copy-code-button"]',
  "background",
  "transparent",
);
assertDeclaration(
  '#content [data-component-part="code-group-tab-bar"] [data-testid="copy-code-button"]',
  "background",
  "transparent",
);
assert.match(
  css,
  /@media \(max-width: 640px\)\s*\{[\s\S]*?#content-area\s*\{[^}]*padding-inline:\s*20px/s,
);
assert.match(
  css,
  /#mobile-nav \[role="group"\]\s*\{[^}]*min-width:\s*140px[^}]*min-height:\s*52px/s,
);
assert.match(
  css,
  /#mobile-nav \[role="group"\] button\[aria-pressed\]\s*\{[^}]*min-width:\s*44px[^}]*min-height:\s*44px/s,
);
console.log("Reference style contract validated for 58 routes.");
