# Seedance Reference Assets PLG Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a bilingual, four-step Flatkey guide that lets a first-time user create a reference asset and use it with `seedance-2.0` without exposing internal configuration.

**Architecture:** Add one English and one Chinese Mintlify guide, register both in the existing Guides navigation, and extend the repository validation script to lock their routes and beginner-focused content. Keep the existing detailed Seedance API Reference unchanged.

**Tech Stack:** Mintlify MDX, `docs.json`, Node.js assertions, GitHub pull requests, Mintlify automatic deployment

---

### Task 1: Lock the new guide contract with a failing validation

**Files:**
- Modify: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Update route counts and add guide-specific assertions**

Replace the current block from `const navigationPages` through the loop that verifies every page file exists with the following block:

```javascript
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
for (const page of seedanceAssetGuides) {
  assert.ok(navigationPages.includes(page), `${page} must be in navigation`);
  const guide = read(`${page}.mdx`);
  for (const requiredText of [
    "https://router.flatkey.ai/v1/assets",
    "https://router.flatkey.ai/v1/videos",
    "asset://ast_",
    "seedance-2.0",
    "YOUR_FLATKEY_API_KEY",
  ]) {
    assert.ok(guide.includes(requiredText), `${page}: ${requiredText}`);
  }
  assert.doesNotMatch(
    guide,
    /BytePlus|Access Key|Secret Access Key|projectName|endpoint ID|端点 ID|项目名|渠道|签名|租约|幂等/i,
  );
  assert.doesNotMatch(guide, /\b(?:ark|sk)-[A-Za-z0-9_-]{20,}\b/);
}
```

Update the final status line:

```javascript
console.log("Reference style contract validated for 60 routes.");
```

- [ ] **Step 2: Run the validation and confirm it fails for the missing routes**

Run:

```powershell
node tests/validate-reference-style.mjs
```

Expected: FAIL because the two new guide routes are not in `docs.json` yet.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add tests/validate-reference-style.mjs
git commit -m "Protect the beginner Seedance guide from internal details" -m "Constraint: The public guide must stay bilingual, copyable, and free of real credentials.`nConfidence: high`nScope-risk: narrow`nTested: Validation fails before the new routes are added.`nNot-tested: Guide pages are not implemented yet."
```

### Task 2: Add the English beginner guide

**Files:**
- Create: `guides/seedance-reference-assets.mdx`

- [ ] **Step 1: Create the English page with the complete four-step flow**

Use this exact page content:

````mdx
---
title: "Generate a Seedance video from a reference"
sidebarTitle: "Seedance reference video"
description: "Create a reusable reference asset, use it with Seedance 2.0, and download the finished video in four steps."
---

Use a public image or video as a reference for your Seedance video. You only need:

- Your Flatkey API Key
- A public HTTPS link to the image or video

This page uses a video as the example. Replace `YOUR_FLATKEY_API_KEY` with the API Key from your Flatkey console.

## 1. Create the reference asset

Paste your public video link into `url` and run:

```bash
curl https://router.flatkey.ai/v1/assets \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/reference.mp4",
    "asset_type": "Video"
  }'
```

The response contains an `id` that starts with `ast_`:

```json
{
  "id": "ast_1234567890abcdefABCDEF1234567890",
  "status": "Processing"
}
```

Copy this `id`. You will use it in the next steps.

## 2. Wait until the asset is ready

Put your asset ID at the end of the URL and run:

```bash
curl https://router.flatkey.ai/v1/assets/ast_1234567890abcdefABCDEF1234567890 \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY"
```

When you see `"status": "Active"`, continue to step 3. If you still see `Processing`, wait a few seconds and run the same command again.

## 3. Create the Seedance video

Add `asset://` before the asset ID, describe the video you want, and run:

```bash
curl https://router.flatkey.ai/v1/videos \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seedance-2.0",
    "content": [
      {
        "type": "video_url",
        "video_url": {
          "url": "asset://ast_1234567890abcdefABCDEF1234567890"
        },
        "role": "reference_video"
      },
      {
        "type": "text",
        "text": "Create a cinematic product video with smooth camera movement"
      }
    ],
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
  }'
```

Copy the returned video task `id`, which starts with `task_`.

<Tip>
  Using an image instead? In step 1, change `Video` to `Image`. In step 3, change both `video_url` values to `image_url`, and change `reference_video` to `reference_image`.
</Tip>

## 4. Get the finished video

Put your video task ID at the end of the URL and run:

```bash
curl https://router.flatkey.ai/v1/videos/task_1234567890abcdefABCDEF1234567890 \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY"
```

If the status is `queued` or `in_progress`, wait a few seconds and run the same command again. When the status is `completed`, open the link in `metadata.url` to download the video.

## If something does not work

- Make sure the reference link starts with `https://` and opens without signing in.
- Wait until the asset status is `Active` before creating the video.
- Make sure you copied the full `ast_...` or `task_...` ID.
- Use the same Flatkey API Key for every step.

Need every available option? See the [Seedance API Reference](/api-reference/seedance-video-generation).
````

- [ ] **Step 2: Check the page for beginner readability and placeholder-only credentials**

Run:

```powershell
rg -n "BytePlus|Access Key|Secret Access Key|projectName|endpoint ID|ark-|sk-" guides/seedance-reference-assets.mdx
```

Expected: no matches.

- [ ] **Step 3: Commit the English guide**

```powershell
git add guides/seedance-reference-assets.mdx
git commit -m "Let first-time users copy a complete Seedance reference flow" -m "Constraint: Explain only the four actions required to obtain a video.`nRejected: Add a parameter catalog | The detailed API reference already serves advanced users.`nConfidence: high`nScope-risk: narrow`nTested: Manual readability and credential-placeholder scan.`nNot-tested: Navigation is added in a later task."
```

### Task 3: Add the matching Chinese beginner guide

**Files:**
- Create: `zh/guides/seedance-reference-assets.mdx`

- [ ] **Step 1: Create the Chinese page with the same four-step flow**

Use this exact page content:

````mdx
---
title: "用参考素材生成 Seedance 视频"
sidebarTitle: "Seedance 参考素材"
description: "只用四步创建可重复使用的参考素材，通过 Seedance 2.0 生成视频并下载结果。"
---

你可以用一张图片或一段视频作为 Seedance 的参考素材。开始前只需要准备：

- Flatkey API Key
- 一个可以直接打开的公网 HTTPS 图片或视频链接

本页使用视频作为示例。请把示例中的 `YOUR_FLATKEY_API_KEY` 替换成 Flatkey 控制台里的 API Key。

## 第 1 步：创建参考素材

把你的视频链接填入 `url`，然后运行：

```bash
curl https://router.flatkey.ai/v1/assets \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/reference.mp4",
    "asset_type": "Video"
  }'
```

返回内容中会有一个以 `ast_` 开头的 `id`：

```json
{
  "id": "ast_1234567890abcdefABCDEF1234567890",
  "status": "Processing"
}
```

复制这个 `id`，后面几步会用到。

## 第 2 步：等待素材可用

把素材 ID 放到地址末尾，然后运行：

```bash
curl https://router.flatkey.ai/v1/assets/ast_1234567890abcdefABCDEF1234567890 \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY"
```

看到 `"status": "Active"` 后，就可以进入第 3 步。如果还是 `Processing`，等几秒后再运行一次相同命令。

## 第 3 步：创建 Seedance 视频

在素材 ID 前加上 `asset://`，写好你想生成的视频内容，然后运行：

```bash
curl https://router.flatkey.ai/v1/videos \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "seedance-2.0",
    "content": [
      {
        "type": "video_url",
        "video_url": {
          "url": "asset://ast_1234567890abcdefABCDEF1234567890"
        },
        "role": "reference_video"
      },
      {
        "type": "text",
        "text": "生成一段有电影质感的产品视频，镜头平滑移动"
      }
    ],
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
  }'
```

复制返回内容中以 `task_` 开头的视频任务 `id`。

<Tip>
  如果使用图片：第 1 步把 `Video` 改成 `Image`；第 3 步把两个 `video_url` 都改成 `image_url`，再把 `reference_video` 改成 `reference_image`。
</Tip>

## 第 4 步：获取生成的视频

把视频任务 ID 放到地址末尾，然后运行：

```bash
curl https://router.flatkey.ai/v1/videos/task_1234567890abcdefABCDEF1234567890 \
  -H "Authorization: Bearer YOUR_FLATKEY_API_KEY"
```

如果状态是 `queued` 或 `in_progress`，等几秒后再运行一次相同命令。状态变成 `completed` 后，打开 `metadata.url` 中的链接即可下载视频。

## 遇到问题时

- 确认参考素材链接以 `https://` 开头，而且不需要登录就能打开。
- 等素材状态变成 `Active` 后再创建视频。
- 确认完整复制了 `ast_...` 或 `task_...` ID。
- 每一步都使用同一个 Flatkey API Key。

需要查看全部可选参数？请打开 [Seedance API 参考](/zh/api-reference/seedance-video-generation)。
````

- [ ] **Step 2: Check the page for beginner readability and placeholder-only credentials**

Run:

```powershell
rg -n "BytePlus|Access Key|Secret Access Key|projectName|端点 ID|项目名|渠道|签名|租约|幂等|ark-|sk-" zh/guides/seedance-reference-assets.mdx
```

Expected: no matches.

- [ ] **Step 3: Commit the Chinese guide**

```powershell
git add zh/guides/seedance-reference-assets.mdx
git commit -m "Give Chinese users the same four-step Seedance path" -m "Constraint: Keep the Chinese and English onboarding flows equivalent.`nConfidence: high`nScope-risk: narrow`nTested: Manual readability and credential-placeholder scan.`nNot-tested: Navigation is added in a later task."
```

### Task 4: Add both guides to navigation and make the contract pass

**Files:**
- Modify: `docs.json`

- [ ] **Step 1: Add the English guide after image generation**

Change the English Guides list to:

```json
"pages": [
  "guides/openai-sdk",
  "guides/anthropic-sdk",
  "guides/codex-cli",
  "guides/codex-desktop",
  "guides/claude-code",
  "guides/image-generation",
  "guides/seedance-reference-assets"
]
```

- [ ] **Step 2: Add the Chinese guide after image generation**

Change the Chinese guide list to:

```json
"pages": [
  "zh/guides/openai-sdk",
  "zh/guides/anthropic-sdk",
  "zh/guides/codex-cli",
  "zh/guides/codex-desktop",
  "zh/guides/claude-code",
  "zh/guides/image-generation",
  "zh/guides/seedance-reference-assets"
]
```

- [ ] **Step 3: Run the repository validation**

Run:

```powershell
node tests/validate-reference-style.mjs
```

Expected:

```text
Reference style contract validated for 60 routes.
```

- [ ] **Step 4: Commit the navigation change**

```powershell
git add docs.json
git commit -m "Make the Seedance reference guide easy to find" -m "Constraint: Publish equivalent entry points in both language navigations.`nConfidence: high`nScope-risk: narrow`nTested: Reference style contract validates all 60 routes.`nNot-tested: Production navigation awaits deployment."
```

### Task 5: Verify, publish, and check production

**Files:**
- Verify: `guides/seedance-reference-assets.mdx`
- Verify: `zh/guides/seedance-reference-assets.mdx`
- Verify: `docs.json`
- Verify: `tests/validate-reference-style.mjs`

- [ ] **Step 1: Run the full local verification set**

Run:

```powershell
node tests/validate-reference-style.mjs
git diff --check origin/main...HEAD
git status --short
rg -n "(ark|sk)-[A-Za-z0-9_-]{20,}|AK[A-Za-z0-9]{20,}|Secret Access Key" guides/seedance-reference-assets.mdx zh/guides/seedance-reference-assets.mdx docs.json tests/validate-reference-style.mjs
```

Expected:

- The validation reports 60 routes.
- `git diff --check` prints nothing.
- `git status --short` prints nothing.
- The credential scan prints nothing.

- [ ] **Step 2: Preview the Mintlify site**

Run from the documentation root:

```powershell
mint dev
```

Open these pages in the local preview and verify the heading, four numbered sections, code blocks, navigation entry, and detailed-reference link:

```text
http://localhost:3000/guides/seedance-reference-assets
http://localhost:3000/zh/guides/seedance-reference-assets
```

- [ ] **Step 3: Push the branch and open a pull request**

```powershell
git push -u origin docs/seedance-reference-assets-plg-guide
gh pr create --base main --head docs/seedance-reference-assets-plg-guide --title "Add a four-step Seedance reference asset guide" --body "Adds bilingual PLG onboarding for creating a reference asset, waiting for Active status, generating with seedance-2.0, and downloading the result. Keeps internal credentials and routing details out of the public guide."
```

- [ ] **Step 4: Wait for checks and merge the pull request**

```powershell
gh pr checks --watch
gh pr merge --squash --delete-branch
```

Expected: all required checks pass and the pull request merges into `main`.

- [ ] **Step 5: Verify the production pages**

Open and inspect:

```text
https://docs.flatkey.ai/guides/seedance-reference-assets
https://docs.flatkey.ai/zh/guides/seedance-reference-assets
```

Confirm both pages return successfully, appear in their Guides navigation, render all four commands, and link to the correct detailed API Reference. If Mintlify does not deploy automatically, use the existing deployment runbook at `docs/project-logs/2026-07-22-seedance-documentation-deployment.md` to trigger a manual update, then repeat the production checks.
