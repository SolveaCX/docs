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
assert.equal(navigationPages.length, 58);
const pages = ["index", "zh/index", ...navigationPages];
assert.equal(pages.length, 60);
assert.equal(new Set(pages).size, 60);
for (const page of pages) {
  assert.ok(existsSync(resolve(root, `${page}.mdx`)), page);
}

const seedanceAssetGuides = [
  "guides/seedance-reference-assets",
  "zh/guides/seedance-reference-assets",
];
const seedanceGuideContracts = {
  "guides/seedance-reference-assets": [
    "## Virtual asset library",
    "## Real-person asset library",
    "limited access",
    "Base URL: `https://router.flatkey.ai`",
    "POST /v1/real-persons",
    "POST /v1/real-persons/{person_id}/verification-sessions",
    "POST /v1/real-persons/{person_id}/assets",
    "GET /v1/real-persons/{person_id}/assets",
    "multipart/form-data",
    "Idempotency-Key",
    "Deleting",
    "404 asset_not_found",
    "asset://<Asset_Id>",
    "asset://ast_",
    "Flatkey public URI",
    "GET and POST",
    "wake-up signal",
    "< 30 MiB",
    "<= 50 MiB",
    "<= 15 MiB",
    "GET /v1/videos/{task_id}",
    "metadata.url",
    "failed",
    "curl -L \"$VIDEO_URL\" -o output.mp4",
    "Public HTTPS URL ingestion",
    "Local multipart ingestion",
    "TOS-first, GCS fallback",
    "do not choose the storage provider",
    "backend availability dependent",
  ],
  "zh/guides/seedance-reference-assets": [
    "## 虚拟素材库",
    "## 真人素材库",
    "受邀开放",
    "Base URL: `https://router.flatkey.ai`",
    "POST /v1/real-persons",
    "POST /v1/real-persons/{person_id}/verification-sessions",
    "POST /v1/real-persons/{person_id}/assets",
    "GET /v1/real-persons/{person_id}/assets",
    "multipart/form-data",
    "Idempotency-Key",
    "Deleting",
    "404 asset_not_found",
    "asset://<Asset_Id>",
    "asset://ast_",
    "Flatkey 公共 URI",
    "GET 和 POST",
    "唤醒信号",
    "< 30 MiB",
    "<= 50 MiB",
    "<= 15 MiB",
    "GET /v1/videos/{task_id}",
    "metadata.url",
    "failed",
    "curl -L \"$VIDEO_URL\" -o output.mp4",
    "公网 HTTPS URL 摄取",
    "本地 multipart 摄取",
    "TOS 优先，GCS fallback",
    "无需选择 provider",
    "取决于后台可用性",
  ],
};
const assertOrderedIncludes = (text, route, label, required) => {
  let index = -1;
  for (const item of required) {
    const next = text.indexOf(item, index + 1);
    assert.ok(next > index, `${route}: ${label}: ${item}`);
    index = next;
  }
};
for (const route of seedanceAssetGuides) {
  assert.ok(navigationPages.includes(route), route);
  const guide = read(`${route}.mdx`);
  for (const required of [
    "https://router.flatkey.ai/v1/assets",
    "https://router.flatkey.ai/v1/videos",
    "asset://ast_",
    "seedance-2.0",
    "YOUR_FLATKEY_API_KEY",
  ]) {
    assert.ok(guide.includes(required), `${route}: ${required}`);
  }
  for (const required of seedanceGuideContracts[route]) {
    assert.ok(guide.includes(required), `${route}: ${required}`);
  }
  if (route.startsWith("zh/")) {
    assertOrderedIncludes(guide, route, "video result workflow", [
      "复制返回的 `task_...`",
      "GET /v1/videos/{task_id}",
      "`completed`",
      "`metadata.url`",
      "curl -L \"$VIDEO_URL\" -o output.mp4",
      "`failed`",
    ]);
    assertOrderedIncludes(guide, route, "asset ingestion paths", [
      "三种后台素材摄取",
      "公网 HTTPS URL 摄取",
      "本地 multipart 摄取",
      "TOS 优先，GCS fallback",
      "无需选择 provider",
      "不会返回临时 URL、bucket 或 BytePlus 凭证",
    ]);
  } else {
    assertOrderedIncludes(guide, route, "video result workflow", [
      "Copy the returned `task_...`",
      "GET /v1/videos/{task_id}",
      "`completed`",
      "`metadata.url`",
      "curl -L \"$VIDEO_URL\" -o output.mp4",
      "`failed`",
    ]);
    assertOrderedIncludes(guide, route, "asset ingestion paths", [
      "Three backend asset ingestion paths",
      "Public HTTPS URL ingestion",
      "Local multipart ingestion",
      "TOS-first, GCS fallback",
      "do not choose the storage provider",
      "temporary URL, bucket, or BytePlus credentials",
    ]);
  }
  assert.doesNotMatch(guide, /\|\s*`Deleted`\s*\|/, `${route}: no pollable Deleted status`);
  assert.doesNotMatch(guide, /usually does not return `asset_uri`|通常不返回 `asset_uri`/, `${route}: virtual asset_uri wording`);
  assert.doesNotMatch(
    guide,
    /Access Key|Secret Access Key|projectName|endpoint ID|internal|configuration|端点 ID|项目名|上游 AssetId|签名 URL|对象 key|租约|内部|配置/i,
    route,
  );
  assert.doesNotMatch(
    guide,
    /\b(?:(?:ark|sk)-[A-Za-z0-9_-]{20,}|AK[A-Za-z0-9]{20,})\b/,
    route,
  );
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
console.log("Reference style contract validated for 60 routes.");
