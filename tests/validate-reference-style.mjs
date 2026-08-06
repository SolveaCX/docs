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
  href: "https://flatkey.ai",
});
assert.equal(config.favicon, "/favicon.svg");
assert.deepEqual(config.appearance, { default: "system", strict: false });
assert.equal(config.styling.codeblocks, "dark");

const navigationPages = config.navigation.languages.flatMap((language) =>
  language.tabs.flatMap((tab) => tab.groups.flatMap((group) => group.pages)),
);
assert.equal(navigationPages.length, 60);
const pages = ["index", "zh/index", ...navigationPages];
assert.equal(pages.length, 62);
assert.equal(new Set(pages).size, 62);
for (const page of pages) {
  assert.ok(existsSync(resolve(root, `${page}.mdx`)), page);
}

const seedanceAssetGuides = ["guides/seedance", "zh/guides/seedance"];
const requiredRedirects = [
  {
    source: "/guides/seedance-reference-assets",
    destination: "/guides/seedance",
    permanent: true,
  },
  {
    source: "/zh/guides/seedance-reference-assets",
    destination: "/zh/guides/seedance",
    permanent: true,
  },
];
const seedanceGuideContracts = {
  "guides/seedance": [
    "limited access",
    "Base URL: `https://router.flatkey.ai`",
    "POST /v1/real-persons",
    "POST /v1/real-persons/{person_id}/verification-sessions",
    "POST /v1/real-persons/{person_id}/assets",
    "GET /v1/real-persons/{person_id}/assets",
    "multipart/form-data",
    "Idempotency-Key",
    "YOUR_UNIQUE_KEY_FOR_THIS_PROFILE",
    '"name": "My first real-person profile"',
    '"name": "Front-facing reference"',
    '-F "name=Front-facing reference"',
    "Deleting",
    "204 No Content",
    "404 asset_not_found",
    "asset://ast_",
    "&lt; 30 MiB",
    "&lt;= 50 MiB",
    "&lt;= 15 MiB",
    "GET /v1/videos/{task_id}",
    "metadata.url",
    "failed",
    "curl -L \"$VIDEO_URL\" -o output.mp4",
    "without an authorization header",
    "Create a virtual asset from a public HTTPS URL",
    "Upload a local file",
  ],
  "zh/guides/seedance": [
    "受邀开放",
    "Base URL: `https://router.flatkey.ai`",
    "POST /v1/real-persons",
    "POST /v1/real-persons/{person_id}/verification-sessions",
    "POST /v1/real-persons/{person_id}/assets",
    "GET /v1/real-persons/{person_id}/assets",
    "multipart/form-data",
    "Idempotency-Key",
    "YOUR_UNIQUE_KEY_FOR_THIS_PROFILE",
    '"name": "我的第一个真人档案"',
    '"name": "正面参考素材"',
    '-F "name=正面参考素材"',
    "Deleting",
    "204 No Content",
    "404 asset_not_found",
    "asset://ast_",
    "&lt; 30 MiB",
    "&lt;= 50 MiB",
    "&lt;= 15 MiB",
    "GET /v1/videos/{task_id}",
    "metadata.url",
    "failed",
    "curl -L \"$VIDEO_URL\" -o output.mp4",
    "不需要鉴权头",
    "用公网 HTTPS URL 创建虚拟素材",
    "上传本地文件",
  ],
};
const seedanceOrderedStructure = {
  "guides/seedance": [
    "## Call Seedance",
    "## Use the asset library",
    "### Virtual assets",
    "### Real-person assets",
  ],
  "zh/guides/seedance": [
    "## 调用 Seedance",
    "## 使用素材库",
    "### 虚拟素材",
    "### 真人素材",
  ],
};
const seedanceCustomerLanguageContracts = {
  "guides/seedance": [
    "Create a virtual asset from a public HTTPS URL",
    "Upload a local file",
  ],
  "zh/guides/seedance": ["用公网 HTTPS URL 创建虚拟素材", "上传本地文件"],
};
const seedanceMetadataContracts = {
  "guides/seedance": {
    title: 'title: "Generate Seedance videos with Flatkey"',
    sidebarTitle: 'sidebarTitle: "Seedance"',
    description: /description:\s*"[^"]*Create Seedance video tasks/i,
  },
  "zh/guides/seedance": {
    title: 'title: "Seedance 调用指南"',
    sidebarTitle: 'sidebarTitle: "Seedance"',
    description: /description:\s*"[^"]*调用 Seedance/,
  },
};
const customerFacingForbiddenTerms = [
  /\bTOS\b/i,
  /\bGCS\b/i,
  /backend/i,
  /upstream/i,
  /private storage/i,
  /BytePlus/i,
  /storage provider/i,
  /bucket/i,
  /backend availability/i,
  /temporary object/i,
  /upstream asset ID/i,
  /rewrite before calling/i,
  /BytePlus credentials/i,
  /后台/i,
  /上游/i,
  /私有存储/i,
  /存储提供商/i,
  /存储桶/i,
  /后台可用性/i,
  /临时对象/i,
  /上游素材 ID/i,
  /调用前改写/i,
  /BytePlus 凭证/i,
  /verification callback can arrive/i,
  /认证回调可以通过/i,
];
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
  const metadata = seedanceMetadataContracts[route];
  assert.ok(guide.includes(metadata.title), `${route}: title`);
  assert.ok(guide.includes(metadata.sidebarTitle), `${route}: sidebarTitle`);
  assert.match(guide, metadata.description, `${route}: description`);
  assertOrderedIncludes(guide, route, "top-level structure", seedanceOrderedStructure[route]);
  for (const required of seedanceCustomerLanguageContracts[route]) {
    assert.ok(guide.includes(required), `${route}: customer language: ${required}`);
  }
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
  } else {
    assertOrderedIncludes(guide, route, "video result workflow", [
      "Copy the returned `task_...`",
      "GET /v1/videos/{task_id}",
      "`completed`",
      "`metadata.url`",
      "curl -L \"$VIDEO_URL\" -o output.mp4",
      "`failed`",
    ]);
  }
  for (const forbidden of customerFacingForbiddenTerms) {
    assert.doesNotMatch(guide, forbidden, `${route}: internal implementation term ${forbidden}`);
  }
  assert.doesNotMatch(guide, /\bjq\b/, `${route}: copyable examples must not require jq`);
  assert.doesNotMatch(guide, /<Asset_Id>/, `${route}: no provider-specific asset URI example`);
  assert.doesNotMatch(guide, /person-create-\d|person-reverify-\d|real-person-asset-(?:url|file)-\d/, `${route}: no reusable fixed idempotency examples`);
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
for (const redirect of requiredRedirects) {
  assert.ok(
    config.redirects?.some(
      (entry) =>
        entry.source === redirect.source &&
        entry.destination === redirect.destination &&
        entry.permanent === redirect.permanent,
    ),
    `docs.json redirect: ${redirect.source} -> ${redirect.destination}`,
  );
}

const minimaxH3Guides = {
  "guides/minimax-h3": {
    title: 'title: "Generate MiniMax H3 videos with Flatkey"',
    sidebarTitle: 'sidebarTitle: "MiniMax H3"',
    workflow: [
      "## Create your first H3 video",
      "POST /v1/videos",
      "Save the returned `task_...`",
      "GET /v1/videos/{task_id}",
      "`completed`",
      "`metadata.url`",
      "minimax-h3.mp4",
      "`failed`",
    ],
    details: [
      "7,000 Unicode characters",
      "| First frame | `image_url` | `first_frame`, or omit the role | 1 image |",
      "| Last frame | `image_url` | `last_frame` | 1 image |",
      "| Reference image | `image_url` | `reference_image` | 9 images |",
      "| Reference video | `video_url` | `reference_video` | 3 videos |",
      "| Reference audio | `audio_url` | `reference_audio` | 3 audio files; also include a reference image or video |",
      "Do not mix first- or last-frame inputs with reference inputs",
      "Reference audio cannot be the only media input.",
      "`21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16`, or `adaptive` with media",
      "works without a Flatkey authorization header",
      "do not log, publish, or share it",
    ],
  },
  "zh/guides/minimax-h3": {
    title: 'title: "MiniMax H3 调用指南"',
    sidebarTitle: 'sidebarTitle: "MiniMax H3"',
    workflow: [
      "## 创建第一个 H3 视频",
      "POST /v1/videos",
      "保存返回的 `task_...`",
      "GET /v1/videos/{task_id}",
      "`completed`",
      "`metadata.url`",
      "minimax-h3.mp4",
      "`failed`",
    ],
    details: [
      "7,000 个 Unicode 字符",
      "| 首帧 | `image_url` | `first_frame`，也可以省略 `role` | 1 张 |",
      "| 尾帧 | `image_url` | `last_frame` | 1 张 |",
      "| 参考图片 | `image_url` | `reference_image` | 9 张 |",
      "| 参考视频 | `video_url` | `reference_video` | 3 段 |",
      "| 参考音频 | `audio_url` | `reference_audio` | 3 段；同时还要提供参考图片或参考视频 |",
      "不要在同一个请求中混用首尾帧和参考素材",
      "参考音频不能作为唯一的媒体输入。",
      "`21:9`、`16:9`、`4:3`、`1:1`、`3:4`、`9:16`；有媒体时可用 `adaptive`",
      "不需要 Flatkey 鉴权头",
      "不要记录到日志、公开或分享",
    ],
  },
};
for (const [route, contract] of Object.entries(minimaxH3Guides)) {
  assert.ok(navigationPages.includes(route), route);
  const guide = read(`${route}.mdx`);
  assert.ok(guide.includes(contract.title), `${route}: title`);
  assert.ok(guide.includes(contract.sidebarTitle), `${route}: sidebarTitle`);
  assertOrderedIncludes(guide, route, "video result workflow", contract.workflow);
  for (const detail of contract.details) {
    assert.ok(guide.includes(detail), `${route}: ${detail}`);
  }
  for (const required of [
    "Base URL: `https://router.flatkey.ai`",
    "https://router.flatkey.ai/v1/videos",
    "MiniMax-H3",
    "YOUR_FLATKEY_API_KEY",
    "`768P`",
    "`2K`",
    "`4`",
    "`15`",
    "first_frame",
    "last_frame",
    "reference_image",
    "reference_video",
    "reference_audio",
    "usage.completion_tokens",
    "usage.total_tokens",
    "callback_url",
    "MiniMax-H3-Context-IR",
  ]) {
    assert.ok(guide.includes(required), `${route}: ${required}`);
  }
  assert.doesNotMatch(
    guide,
    /\b(?:(?:ark|sk)-[A-Za-z0-9_-]{20,}|AK[A-Za-z0-9]{20,})\b/,
    `${route}: real credential`,
  );
  assert.doesNotMatch(guide, /\bjq\b/, `${route}: examples must not require jq`);
  assert.doesNotMatch(
    guide,
    /upstream|channel ID|内部渠道|上游|渠道 ID/i,
    `${route}: internal implementation language`,
  );
  for (const forbidden of customerFacingForbiddenTerms) {
    assert.doesNotMatch(guide, forbidden, `${route}: internal implementation term ${forbidden}`);
  }
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
  '#content [data-testid="copy-code-button"]',
  "background",
  "rgba(245, 245, 242, 0.08)",
);
assertDeclaration(
  '#content .code-group [data-testid="copy-code-button"]',
  "background",
  "rgba(245, 245, 242, 0.08)",
);
assertDeclaration(
  '#content [data-component-part="code-group-tab-bar"] [data-testid="copy-code-button"]',
  "background",
  "rgba(245, 245, 242, 0.08)",
);
assertDeclaration(
  '#content [data-testid="copy-code-button"] svg',
  "color",
  "currentColor",
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
