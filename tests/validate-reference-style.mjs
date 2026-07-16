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
for (const page of pages) {
  assert.ok(existsSync(resolve(root, `${page}.mdx`)), page);
}

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

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
console.log("Reference style contract validated for 56 routes.");
