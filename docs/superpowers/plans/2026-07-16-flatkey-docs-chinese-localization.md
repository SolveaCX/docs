# Flatkey Docs Chinese Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete Simplified Chinese mirror of all 28 Flatkey documentation pages, expose Mintlify's native English/Chinese switcher, and use four real Chinese Console screenshots in the Chinese Quickstart.

**Architecture:** Keep English content and URLs at the repository root, mirror the same file tree under `zh/`, and make `navigation.languages` the sole top-level navigation division. Each language owns its labels, navbar, tabs, groups, and unique page paths; shared product/API values remain unchanged.

**Tech Stack:** Mintlify MDX, `docs.json`, PowerShell validation, OpenCLI Browser Bridge, Git/GitHub, Mintlify Draft Preview.

---

### Task 1: Capture the Chinese Console screenshots

**Files:**
- Create: `images/quickstart/zh/flatkey-top-up.png`
- Create: `images/quickstart/zh/flatkey-api-keys.png`
- Create: `images/quickstart/zh/flatkey-create-api-key.png`
- Create: `images/quickstart/zh/flatkey-usage-logs.png`
- Reference: `images/quickstart/flatkey-top-up.png`
- Reference: `images/quickstart/flatkey-api-keys.png`
- Reference: `images/quickstart/flatkey-create-api-key.png`
- Reference: `images/quickstart/flatkey-usage-logs.png`

- [ ] **Step 1: Inspect the existing image dimensions and framing**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem images/quickstart/*.png | ForEach-Object {
  $image = [System.Drawing.Image]::FromFile($_.FullName)
  [pscustomobject]@{ Name = $_.Name; Width = $image.Width; Height = $image.Height }
  $image.Dispose()
}
```

Expected: four English images are listed with readable dimensions.

- [ ] **Step 2: Switch the signed-in Flatkey Console to Chinese**

Run the existing OpenCLI session and inspect the current page:

```powershell
opencli browser flatkey-console state
opencli browser flatkey-console find --role button --name "Change language"
opencli browser flatkey-console click --role button --name "Change language"
opencli browser flatkey-console click --text "中文"
opencli browser flatkey-console state
```

Expected: the final state contains Chinese navigation labels. Do not inspect cookies, storage, credentials, or session tokens.

- [ ] **Step 3: Capture the four matching task views**

Navigate with the visible Console UI or safe first-party routes, wait for each view to finish loading, and save screenshots directly to the four paths above:

```powershell
New-Item -ItemType Directory -Path images/quickstart/zh -Force
opencli browser flatkey-console screenshot "E:\workspace\flatkey-docs-worktrees\quickstart-client-guides\images\quickstart\zh\flatkey-top-up.png"
opencli browser flatkey-console screenshot "E:\workspace\flatkey-docs-worktrees\quickstart-client-guides\images\quickstart\zh\flatkey-api-keys.png"
opencli browser flatkey-console screenshot "E:\workspace\flatkey-docs-worktrees\quickstart-client-guides\images\quickstart\zh\flatkey-create-api-key.png"
opencli browser flatkey-console screenshot "E:\workspace\flatkey-docs-worktrees\quickstart-client-guides\images\quickstart\zh\flatkey-usage-logs.png"
```

Before each capture, collapse or avoid account menus and ensure no API key value, email address, or other sensitive value is visible.

- [ ] **Step 4: Verify image integrity and privacy**

Run the dimension command from Step 1 against `images/quickstart/zh/*.png`, then visually inspect each image. Expected: all four files decode successfully, show Chinese Console labels, and contain no sensitive values.

### Task 2: Add the native language switcher without moving English routes

**Files:**
- Modify: `docs.json`

- [ ] **Step 1: Run the pre-change navigation assertion**

```powershell
$docs = Get-Content -Raw -Encoding utf8 docs.json | ConvertFrom-Json
if ($docs.navigation.languages) { throw 'Expected languages to be absent before implementation' }
```

Expected: command exits successfully before the change.

- [ ] **Step 2: Replace the top-level tabs with language-owned tabs**

Keep the existing site colors, theme, favicon, and name. Replace `navigation.tabs` with this complete shape:

```json
"navigation": {
  "languages": [
    {
      "language": "en",
      "navbar": {
        "primary": {
          "type": "button",
          "label": "Console",
          "href": "https://console.flatkey.ai/dashboard"
        }
      },
      "tabs": [
        {
          "tab": "Documentation",
          "groups": [
            { "group": "Get Started", "pages": ["introduction", "quickstart", "authentication"] },
            { "group": "Core Concepts", "pages": ["concepts/models", "concepts/routing", "concepts/billing"] },
            { "group": "Guides", "pages": ["guides/openai-sdk", "guides/anthropic-sdk", "guides/codex-cli", "guides/codex-desktop", "guides/claude-code", "guides/image-generation"] },
            { "group": "Dashboard", "pages": ["dashboard/api-keys", "dashboard/usage", "dashboard/top-up"] },
            { "group": "Reference", "pages": ["reference/model-list", "reference/pricing", "reference/model-health", "reference/faq"] }
          ]
        },
        {
          "tab": "API Reference",
          "groups": [
            { "group": "Overview", "pages": ["api-reference/overview", "api-reference/authentication", "api-reference/errors"] },
            { "group": "Endpoints", "pages": ["api-reference/chat-completions", "api-reference/responses", "api-reference/embeddings", "api-reference/image-generation", "api-reference/models"] }
          ]
        }
      ]
    },
    {
      "language": "zh",
      "navbar": {
        "primary": {
          "type": "button",
          "label": "控制台",
          "href": "https://console.flatkey.ai/dashboard?lng=zh"
        }
      },
      "tabs": [
        {
          "tab": "文档",
          "groups": [
            { "group": "快速入门", "pages": ["zh/introduction", "zh/quickstart", "zh/authentication"] },
            { "group": "核心概念", "pages": ["zh/concepts/models", "zh/concepts/routing", "zh/concepts/billing"] },
            { "group": "使用指南", "pages": ["zh/guides/openai-sdk", "zh/guides/anthropic-sdk", "zh/guides/codex-cli", "zh/guides/codex-desktop", "zh/guides/claude-code", "zh/guides/image-generation"] },
            { "group": "控制台", "pages": ["zh/dashboard/api-keys", "zh/dashboard/usage", "zh/dashboard/top-up"] },
            { "group": "参考", "pages": ["zh/reference/model-list", "zh/reference/pricing", "zh/reference/model-health", "zh/reference/faq"] }
          ]
        },
        {
          "tab": "API 参考",
          "groups": [
            { "group": "概览", "pages": ["zh/api-reference/overview", "zh/api-reference/authentication", "zh/api-reference/errors"] },
            { "group": "端点", "pages": ["zh/api-reference/chat-completions", "zh/api-reference/responses", "zh/api-reference/embeddings", "zh/api-reference/image-generation", "zh/api-reference/models"] }
          ]
        }
      ]
    }
  ]
}
```

Remove the old global `navbar` because the two language entries now own their localized navbar labels.

- [ ] **Step 3: Validate JSON and language ownership**

```powershell
$docs = Get-Content -Raw -Encoding utf8 docs.json | ConvertFrom-Json
if (($docs.navigation.languages.language -join ',') -ne 'en,zh') { throw 'Expected en,zh language order' }
if ($docs.navigation.languages[0].navbar.primary.label -ne 'Console') { throw 'English navbar label mismatch' }
if ($docs.navigation.languages[1].navbar.primary.label -ne '控制台') { throw 'Chinese navbar label mismatch' }
```

Expected: command exits successfully.

### Task 3: Translate the landing, getting-started, concepts, dashboard, and reference pages

**Files:**
- Create: `zh/index.mdx`
- Create: `zh/introduction.mdx`
- Create: `zh/quickstart.mdx`
- Create: `zh/authentication.mdx`
- Create: `zh/concepts/models.mdx`
- Create: `zh/concepts/routing.mdx`
- Create: `zh/concepts/billing.mdx`
- Create: `zh/dashboard/api-keys.mdx`
- Create: `zh/dashboard/usage.mdx`
- Create: `zh/dashboard/top-up.mdx`
- Create: `zh/reference/model-list.mdx`
- Create: `zh/reference/pricing.mdx`
- Create: `zh/reference/model-health.mdx`
- Create: `zh/reference/faq.mdx`

- [ ] **Step 1: Establish the mirrored directories**

Create `zh/`, `zh/concepts/`, `zh/dashboard/`, and `zh/reference/` through the first `apply_patch` additions; do not add empty placeholder files.

- [ ] **Step 2: Add complete Chinese translations**

For every file listed above, preserve the exact MDX component tree, code blocks, commands, model IDs, environment variables, API routes, numeric pricing, and external URLs from its English source. Translate all frontmatter values and user-visible prose. Rewrite every internal link from `/path` to `/zh/path`.

In `zh/quickstart.mdx`, use exactly these image paths:

```mdx
![在 Flatkey 钱包中选择预付费套餐](/images/quickstart/zh/flatkey-top-up.png)
![打开 API 密钥页面并选择创建 API 密钥](/images/quickstart/zh/flatkey-api-keys.png)
![设置 Flatkey API 密钥的名称、额度和有效期](/images/quickstart/zh/flatkey-create-api-key.png)
![在 Flatkey 用量日志中使用模型名称筛选器](/images/quickstart/zh/flatkey-usage-logs.png)
```

- [ ] **Step 3: Run structural parity checks**

```powershell
$sources = @('index.mdx','introduction.mdx','quickstart.mdx','authentication.mdx','concepts/models.mdx','concepts/routing.mdx','concepts/billing.mdx','dashboard/api-keys.mdx','dashboard/usage.mdx','dashboard/top-up.mdx','reference/model-list.mdx','reference/pricing.mdx','reference/model-health.mdx','reference/faq.mdx')
foreach ($source in $sources) {
  $translated = Join-Path 'zh' $source
  if (-not (Test-Path -LiteralPath $translated)) { throw "Missing $translated" }
  if (-not (Select-String -LiteralPath $translated -Pattern '^title:' -Quiet)) { throw "Missing title in $translated" }
  if (-not (Select-String -LiteralPath $translated -Pattern '^description:' -Quiet)) { throw "Missing description in $translated" }
}
```

Expected: all 14 translated files pass.

### Task 4: Translate the client and image guides

**Files:**
- Create: `zh/guides/openai-sdk.mdx`
- Create: `zh/guides/anthropic-sdk.mdx`
- Create: `zh/guides/codex-cli.mdx`
- Create: `zh/guides/codex-desktop.mdx`
- Create: `zh/guides/claude-code.mdx`
- Create: `zh/guides/image-generation.mdx`

- [ ] **Step 1: Add all six guide translations**

Preserve every executable snippet exactly, including Flatkey base URLs, environment variable names, JSON/TOML keys, file paths, model IDs, and CC Switch field values. Translate headings, setup instructions, warnings, troubleshooting tables, link labels, and explanatory comments. Rewrite internal documentation links to `/zh/...`.

- [ ] **Step 2: Verify client-specific invariants**

```powershell
$required = @{
  'zh/guides/codex-cli.mdx' = @('https://router.flatkey.ai/v1','OPENAI_API_KEY','OPENAI_BASE_URL','CC Switch')
  'zh/guides/codex-desktop.mdx' = @('https://router.flatkey.ai/v1','model_provider','env_key','wire_api = "responses"','CC Switch')
  'zh/guides/claude-code.mdx' = @('ANTHROPIC_BASE_URL','ANTHROPIC_API_KEY','CC Switch')
  'zh/guides/openai-sdk.mdx' = @('https://router.flatkey.ai/v1')
  'zh/guides/anthropic-sdk.mdx' = @('https://router.flatkey.ai')
  'zh/guides/image-generation.mdx' = @('/v1/images/generations')
}
foreach ($file in $required.Keys) {
  $body = Get-Content -Raw -Encoding utf8 $file
  foreach ($token in $required[$file]) { if (-not $body.Contains($token)) { throw "$file lost $token" } }
}
```

Expected: all required client configuration values remain present.

### Task 5: Translate the complete API reference

**Files:**
- Create: `zh/api-reference/overview.mdx`
- Create: `zh/api-reference/authentication.mdx`
- Create: `zh/api-reference/errors.mdx`
- Create: `zh/api-reference/chat-completions.mdx`
- Create: `zh/api-reference/responses.mdx`
- Create: `zh/api-reference/embeddings.mdx`
- Create: `zh/api-reference/image-generation.mdx`
- Create: `zh/api-reference/models.mdx`

- [ ] **Step 1: Add all eight API reference translations**

Translate descriptions, field explanations, callouts, error guidance, tables, and visible request/response annotations. Preserve HTTP methods, paths, JSON property names, curl flags, status codes, headers, authentication syntax, example payload values, and response shapes exactly.

- [ ] **Step 2: Verify endpoint and schema invariants**

```powershell
$pairs = @{
  'zh/api-reference/chat-completions.mdx' = '/v1/chat/completions'
  'zh/api-reference/responses.mdx' = '/v1/responses'
  'zh/api-reference/embeddings.mdx' = '/v1/embeddings'
  'zh/api-reference/image-generation.mdx' = '/v1/images/generations'
  'zh/api-reference/models.mdx' = '/v1/models'
}
foreach ($file in $pairs.Keys) {
  $body = Get-Content -Raw -Encoding utf8 $file
  if (-not $body.Contains($pairs[$file])) { throw "$file lost endpoint $($pairs[$file])" }
}
```

Expected: every endpoint remains exact.

### Task 6: Run complete local validation

**Files:**
- Verify: `docs.json`
- Verify: all root and `zh/**/*.mdx` files
- Verify: `images/quickstart/zh/*.png`

- [ ] **Step 1: Verify page counts and mirrored paths**

```powershell
$english = rg --files -g '*.mdx' -g '!zh/**'
$chinese = rg --files zh -g '*.mdx'
if ($english.Count -ne 28) { throw "Expected 28 English MDX files, got $($english.Count)" }
if ($chinese.Count -ne 28) { throw "Expected 28 Chinese MDX files, got $($chinese.Count)" }
foreach ($source in $english) {
  $mirror = Join-Path 'zh' $source
  if (-not (Test-Path -LiteralPath $mirror)) { throw "Missing mirror $mirror" }
}
```

Expected: 28 English and 28 Chinese pages with one-to-one paths.

- [ ] **Step 2: Verify internal Chinese links never fall back to English**

```powershell
$badLinks = Get-ChildItem zh -Recurse -Filter *.mdx |
  Select-String -Pattern '\]\(/(?!zh/|images/)'
if ($badLinks) { $badLinks; throw 'Found non-localized internal links' }
```

Expected: no matches. External `https://` links and `/images/...` paths are allowed.

- [ ] **Step 3: Check source invariants and diff hygiene**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only `docs.json`, `zh/**`, the four Chinese images, plan/spec artifacts, and intended commits appear.

- [ ] **Step 4: Validate every configured page exists and is unique**

```powershell
$docs = Get-Content -Raw -Encoding utf8 docs.json | ConvertFrom-Json
$pages = @(
  $docs.navigation.languages | ForEach-Object {
    $_.tabs | ForEach-Object {
      $_.groups | ForEach-Object { $_.pages }
    }
  }
)
if ($pages.Count -ne 54) { throw "Expected 54 navigated pages, got $($pages.Count)" }
$duplicates = $pages | Group-Object | Where-Object Count -gt 1
if ($duplicates) { $duplicates | Format-Table; throw 'Duplicate navigation paths found' }
foreach ($page in $pages) {
  if (-not (Test-Path -LiteralPath "$page.mdx")) { throw "Missing configured page $page.mdx" }
}
if (-not (Test-Path index.mdx) -or -not (Test-Path zh/index.mdx)) { throw 'Missing landing page mirror' }
```

Expected: all 54 navigated page paths resolve uniquely; `index.mdx` and `zh/index.mdx` exist as the two unlisted landing pages.

### Task 7: Commit, push, build, and verify the Draft Preview

**Files:**
- Commit: `docs.json`
- Commit: `zh/**`
- Commit: `images/quickstart/zh/**`
- Commit: `docs/superpowers/plans/2026-07-16-flatkey-docs-chinese-localization.md`

- [ ] **Step 1: Commit with the Lore protocol**

```powershell
git add -- docs.json zh images/quickstart/zh docs/superpowers/plans/2026-07-16-flatkey-docs-chinese-localization.md
git commit -m "Give Chinese readers complete parity without moving existing English routes" -m "Constraint: Existing English URLs and Mintlify release settings must remain unchanged`nRejected: Partial translation | It would leave mixed-language navigation and content`nConfidence: high`nScope-risk: moderate`nDirective: Keep the zh tree mirrored whenever English pages change`nTested: JSON, route ownership, 28-page parity, internal links, endpoint invariants, screenshot integrity, and Draft Preview`nNot-tested: Production docs.flatkey.ai until the user merges the PR and Manual update runs"
```

Expected: one commit contains only the intended localization implementation and plan.

- [ ] **Step 2: Push only the existing feature branch**

```powershell
git push origin HEAD:partner/mintlify-update-ebvtws4
```

Expected: the existing PR updates; no push targets `main`.

- [ ] **Step 3: Wait for and inspect the new Mintlify Draft build**

Use the existing Mintlify Dashboard/Preview browser sessions. Confirm the latest build corresponds to the pushed commit and reaches a successful terminal state. If it fails, inspect the reported file/line, fix the current feature branch, rerun local validation, push, and wait for the replacement build.

- [ ] **Step 4: Verify the language switcher and page parity**

On desktop and mobile preview widths, verify:

- The language control is visible.
- Its options are `English` and `中文`.
- `/quickstart` switches to `/zh/quickstart` and back.
- A guide page and an API reference page also switch to their matching paths.
- Chinese navigation labels remain Chinese.
- No sampled page opens the homepage or a 404 during language switching.

- [ ] **Step 5: Verify the four Chinese screenshots in preview**

Open `/zh/quickstart`, scroll to each image, and verify it loads, uses Chinese Console UI, remains readable on desktop/mobile, and exposes no sensitive information. Confirm `/quickstart` still uses the original English images.

- [ ] **Step 6: Report the publication boundary**

Report the updated PR and Draft Preview evidence. Do not merge or push `main`. After the user merges the PR, use the existing Mintlify Dashboard `Manual update` flow and reload `https://docs.flatkey.ai` to verify production.
