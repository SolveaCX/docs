# Flatkey CC Switch Expanded Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the English and Chinese Claude Code, Codex CLI, and Codex Desktop CC Switch sections into screenshot-led, independently usable setup guides.

**Architecture:** Keep the existing six Mintlify routes and manual setup paths. Add complete CC Switch workflows inside each page, reuse the shared Codex configuration screenshots between CLI and Desktop, and maintain separate English and Chinese screenshot directories. Validate factual claims against CC Switch v3.17.0 upstream sources, current OpenAI Codex documentation, the live UI, and Flatkey Usage Logs.

**Tech Stack:** Mintlify MDX, Markdown tables and callouts, PNG screenshots, PowerShell validation, CC Switch v3.17.0, Git.

---

## File map

**Modify:**

- `guides/claude-code.mdx` — English Claude Code CC Switch workflow.
- `guides/codex-cli.mdx` — English Codex CLI CC Switch workflow.
- `guides/codex-desktop.mdx` — English Codex Desktop CC Switch workflow.
- `zh/guides/claude-code.mdx` — Chinese Claude Code workflow matching the English structure.
- `zh/guides/codex-cli.mdx` — Chinese Codex CLI workflow matching the English structure.
- `zh/guides/codex-desktop.mdx` — Chinese Codex Desktop workflow matching the English structure.

**Create:**

- `images/guides/cc-switch/en/claude-provider-list.png`
- `images/guides/cc-switch/en/claude-provider-form.png`
- `images/guides/cc-switch/en/claude-provider-active.png`
- `images/guides/cc-switch/en/codex-provider-list.png`
- `images/guides/cc-switch/en/codex-provider-form.png`
- `images/guides/cc-switch/en/codex-model-mapping.png`
- `images/guides/cc-switch/en/codex-provider-active.png`
- `images/guides/cc-switch/en/codex-login-preservation.png`
- `images/guides/cc-switch/en/codex-cli-verify.png`
- `images/guides/cc-switch/en/codex-desktop-verify.png`
- The same ten filenames under `images/guides/cc-switch/zh/`, captured with the Chinese UI.

Do not modify `docs.json` unless an image or route validation proves a navigation change is required.

### Task 1: Lock current upstream facts and baseline

**Files:**

- Read: `docs/superpowers/specs/2026-07-20-flatkey-ccswitch-expanded-guides-design.md`
- Read: the six MDX files in the file map.
- Read: CC Switch v3.17.0 official release and user guides.
- Read: current Codex manual configuration and authentication sections.

- [ ] **Step 1: Verify the worktree baseline**

Run:

```powershell
git status --short
git branch --show-current
$null = Get-Content -Raw -Encoding UTF8 docs.json | ConvertFrom-Json
```

Expected: clean status, branch `docs/ccswitch-expanded-guides`, and no JSON error.

- [ ] **Step 2: Record the content contract used by later tasks**

Use these verified facts:

```text
CC Switch version: v3.17.0
Claude Base URL: https://router.flatkey.ai
Codex Base URL: https://router.flatkey.ai/v1
Codex upstream format: Responses (native) / Responses（原生）
Local Routing for Flatkey Codex: not required
English login-preservation label: Keep official login for direct switches
Chinese login-preservation label: 非接管切换时保留官方登录
Codex config source: ~/.codex/config.toml is shared by the desktop app and CLI
Credential boundary: auth.json or the OS credential store contains sensitive login credentials
```

Evidence:

- `https://github.com/farion1231/cc-switch/releases/tag/v3.17.0`
- `https://github.com/farion1231/cc-switch/blob/v3.17.0/docs/guides/codex-official-auth-preservation-guide-en.md`
- `https://github.com/farion1231/cc-switch/blob/v3.17.0/docs/guides/codex-official-auth-preservation-guide-zh.md`
- `https://learn.chatgpt.com/docs/config-file/config-advanced`
- `https://learn.chatgpt.com/docs/authentication`
- `https://learn.chatgpt.com/docs/models`

- [ ] **Step 3: Confirm that Flatkey is not presented as a built-in preset**

Run:

```powershell
rg -n -i "Flatkey preset|Flatkey 预设|built-in Flatkey|内置 Flatkey" guides zh/guides
```

Expected: no affirmative claim that Flatkey is built into CC Switch.

### Task 2: Capture the English screenshot set

**Files:** Create the ten PNG files under `images/guides/cc-switch/en/`.

- [ ] **Step 1: Prepare a sanitized temporary provider**

In CC Switch v3.17.0, switch the language to English. Create temporary providers named `Flatkey Docs` only. Use a masked real key for connectivity checks or the literal placeholder `sk-fk-example` for form-only screenshots. Do not edit existing providers.

- [ ] **Step 2: Capture the Claude Code sequence**

Capture cropped application-window images showing:

```text
claude-provider-list.png    Claude Code provider panel and Add Provider entry
claude-provider-form.png    Provider Name, API Key, API Endpoint, and model fields
claude-provider-active.png  Flatkey Docs card in the enabled/current state
```

The endpoint visible in `claude-provider-form.png` must be `https://router.flatkey.ai` without `/v1`.

- [ ] **Step 3: Capture the shared Codex sequence**

Capture:

```text
codex-provider-list.png       Codex provider panel and Add Provider entry
codex-provider-form.png       API Key, API Endpoint, Default Model, and Upstream Format
codex-model-mapping.png       Model Mapping and Fetch Models controls
codex-provider-active.png     Flatkey Docs card in the enabled/current state
codex-login-preservation.png  Settings > General > Codex App Enhancements toggle
```

The form must visibly use `https://router.flatkey.ai/v1` and `Responses (native)`. The settings image must show `Keep official login for direct switches`.

- [ ] **Step 4: Capture validation images**

Capture:

```text
codex-cli-verify.png      a new terminal/Codex CLI session returning a minimal result
codex-desktop-verify.png  a new Codex Desktop conversation after the provider switch
```

Crop out local usernames, workspace paths, unrelated tabs, balances, account names, and emails.

- [ ] **Step 5: Inspect every English image**

Use local image inspection on all ten files. Expected: English UI, no readable secret, no personal data, legible controls, and no full-desktop capture.

If the Computer Use runtime is unavailable, do not fabricate or AI-generate screenshots. Continue with content tasks, leave image references out until real screenshots exist, and report the exact screenshot blocker before completion.

### Task 3: Capture the Chinese screenshot set

**Files:** Create the same ten filenames under `images/guides/cc-switch/zh/`.

- [ ] **Step 1: Switch CC Switch to Chinese**

Keep the same sanitized temporary provider values and switch only the application language.

- [ ] **Step 2: Repeat the Claude and Codex captures**

Use the same window dimensions, crop, zoom, and provider state as the English set. The Codex form must show `Responses（原生）`; the settings image must show `非接管切换时保留官方登录`.

- [ ] **Step 3: Capture Chinese validation images**

Use a minimal Chinese request such as `请只回复 OK` in a new CLI/Desktop session. Crop out local and account information.

- [ ] **Step 4: Inspect every Chinese image**

Expected: Chinese UI, layout parity with the English counterpart, no secret or personal data, and legible text.

- [ ] **Step 5: Clean temporary application state**

Delete only the `Flatkey Docs` temporary providers created for screenshots and restore the original CC Switch language. Do not delete or change pre-existing providers.

### Task 4: Expand the Claude Code pages

**Files:**

- Modify: `guides/claude-code.mdx`
- Modify: `zh/guides/claude-code.mdx`
- Reference: the three Claude screenshots in each language directory.

- [ ] **Step 1: Replace the short CC Switch section with the English workflow**

Use this heading structure:

```mdx
## Configure with CC Switch
### 1. Install CC Switch
### 2. Open the Claude Code provider panel
### 3. Add Flatkey as a custom provider
### 4. Save and activate Flatkey
### 5. Restart and verify
### Switch back to another provider
### Troubleshooting CC Switch
```

The field table must contain:

```md
| Field | Value |
|---|---|
| Provider name | `Flatkey` |
| API key | Your Flatkey key (`sk-fk-...`) |
| API endpoint | `https://router.flatkey.ai` |
| Model | An exact ID from the Flatkey Model Directory |
```

Add a `Warning` that the endpoint must not end in `/v1`, a `Tip` to test in a small directory, and a troubleshooting table covering authentication, connection, wrong provider, stale process, balance, and missing Usage Logs.

- [ ] **Step 2: Add the English screenshots beside their steps**

Use absolute Mintlify paths and specific alt text:

```mdx
![Open the Claude Code provider panel in CC Switch](/images/guides/cc-switch/en/claude-provider-list.png)
![Enter the Flatkey Claude Code provider settings](/images/guides/cc-switch/en/claude-provider-form.png)
![Activate the Flatkey provider for Claude Code](/images/guides/cc-switch/en/claude-provider-active.png)
```

- [ ] **Step 3: Implement the matching Chinese workflow**

Use the same section order and fields, translated as:

```mdx
## 使用 CC Switch 配置
### 1. 安装 CC Switch
### 2. 打开 Claude Code 供应商面板
### 3. 将 Flatkey 添加为自定义供应商
### 4. 保存并启用 Flatkey
### 5. 重启并验证
### 切换回其他供应商
### CC Switch 故障排查
```

Reference the three `/zh/` images with Chinese alt text.

- [ ] **Step 4: Validate the Claude contract**

Run:

```powershell
$files = @('guides/claude-code.mdx','zh/guides/claude-code.mdx')
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file
  if ($text -notmatch 'https://router\.flatkey\.ai') { throw "$file missing Flatkey URL" }
  if ($text -match 'router\.flatkey\.ai/v1') { throw "$file incorrectly uses /v1" }
}
rg -n "images/guides/cc-switch/(en|zh)/claude-" $files
git diff --check
```

Expected: both files contain the three image references, no Claude URL uses `/v1`, and `git diff --check` is clean.

- [ ] **Step 5: Commit the Claude pages and images**

Commit only the two Claude MDX files and six Claude screenshots with a Lore-format message. `Tested:` must name the URL and image-reference checks.

### Task 5: Expand the Codex CLI pages

**Files:**

- Modify: `guides/codex-cli.mdx`
- Modify: `zh/guides/codex-cli.mdx`
- Reference: the shared Codex provider screenshots plus the CLI validation image.

- [ ] **Step 1: Replace the English CC Switch section**

Use:

```mdx
## Configure with CC Switch
### 1. Install CC Switch
### 2. Open the Codex provider panel
### 3. Add Flatkey as a custom provider
### 4. Configure the model
### 5. Save and activate Flatkey
### 6. Restart and verify
### Switch back to another provider
### Troubleshooting CC Switch
```

The table must show `https://router.flatkey.ai/v1`, `Responses (native)`, a Flatkey key, and an exact model ID. State that Flatkey natively supports Responses and therefore does not require Local Routing. Explain that model mapping controls the `/model` menu but a valid default model can still be requested directly.

- [ ] **Step 2: Add the English Codex images**

Reference:

```text
/images/guides/cc-switch/en/codex-provider-list.png
/images/guides/cc-switch/en/codex-provider-form.png
/images/guides/cc-switch/en/codex-model-mapping.png
/images/guides/cc-switch/en/codex-provider-active.png
/images/guides/cc-switch/en/codex-cli-verify.png
```

- [ ] **Step 3: Implement the matching Chinese workflow**

Use the exact v3.17.0 UI label `Responses（原生）` and the same five images from the `/zh/` directory.

- [ ] **Step 4: Validate the Codex CLI contract**

Run:

```powershell
$files = @('guides/codex-cli.mdx','zh/guides/codex-cli.mdx')
foreach ($file in $files) {
  $text = Get-Content -Raw -Encoding UTF8 $file
  if ($text -notmatch 'https://router\.flatkey\.ai/v1') { throw "$file missing /v1" }
  if ($text -notmatch 'Responses') { throw "$file missing Responses" }
  if ($text -notmatch 'Local Routing|本地路由') { throw "$file missing routing guidance" }
}
rg -n "images/guides/cc-switch/(en|zh)/codex-" $files
git diff --check
```

Expected: both pages contain the correct endpoint, protocol, routing explanation, five image references, and no whitespace error.

- [ ] **Step 5: Commit the Codex CLI pages and CLI validation images**

Use a Lore-format commit. Include the five verified contract items in `Tested:`.

### Task 6: Expand the Codex Desktop pages

**Files:**

- Modify: `guides/codex-desktop.mdx`
- Modify: `zh/guides/codex-desktop.mdx`
- Reference: shared Codex provider screenshots, login-preservation screenshot, and Desktop validation image.

- [ ] **Step 1: Replace the English CC Switch section**

Use:

```mdx
## Configure with CC Switch
### 1. Complete one official sign-in
### 2. Preserve the official login for direct switches
### 3. Add Flatkey as a custom provider
### 4. Configure the model
### 5. Save, activate, and restart
### 6. Verify the actual route
### If the model is not visible
### Switch back to the official provider
### Troubleshooting CC Switch
```

Use the exact English v3.17.0 setting label. Explain that `auth.json` or the OS credential store contains sensitive official credentials, while the shared `config.toml` controls model/provider settings. Do not instruct readers to open, copy, replace, or paste a Flatkey key into `auth.json`.

- [ ] **Step 2: Add the English Desktop images**

Reference the settings image, shared provider form/mapping/active images, and `codex-desktop-verify.png`.

- [ ] **Step 3: Implement the matching Chinese workflow**

Use the exact Chinese setting label `非接管切换时保留官方登录`. Keep the same safety boundary and use the Chinese screenshot set.

- [ ] **Step 4: Validate the Desktop contract**

Run:

```powershell
$en = Get-Content -Raw -Encoding UTF8 'guides/codex-desktop.mdx'
$zh = Get-Content -Raw -Encoding UTF8 'zh/guides/codex-desktop.mdx'
if ($en -notmatch 'Keep official login for direct switches') { throw 'English v3.17 label missing' }
if ($zh -notmatch '非接管切换时保留官方登录') { throw 'Chinese v3.17 label missing' }
foreach ($text in @($en,$zh)) {
  if ($text -notmatch 'https://router\.flatkey\.ai/v1') { throw 'Desktop endpoint missing' }
  if ($text -notmatch 'auth\.json') { throw 'Credential warning missing' }
  if ($text -notmatch 'Usage Logs|用量日志') { throw 'Route verification missing' }
}
git diff --check
```

Expected: exact UI labels, correct endpoint, credential warning, Usage Logs verification, and no whitespace error.

- [ ] **Step 5: Commit the Desktop pages and remaining images**

Use a Lore-format commit and identify the upstream v3.17.0 label check in `Tested:`.

### Task 7: Run full documentation verification

**Files:** All six MDX files, twenty PNG files, the design, and this plan.

- [ ] **Step 1: Check image existence and parity**

Run:

```powershell
$en = Get-ChildItem 'images/guides/cc-switch/en' -Filter '*.png' | Select-Object -ExpandProperty Name
$zh = Get-ChildItem 'images/guides/cc-switch/zh' -Filter '*.png' | Select-Object -ExpandProperty Name
if ($en.Count -ne 10 -or $zh.Count -ne 10) { throw 'Expected ten screenshots per language' }
if (Compare-Object $en $zh) { throw 'Screenshot filenames are not language-parallel' }
```

Expected: ten files per language and no filename difference.

- [ ] **Step 2: Check MDX image references and internal links**

Extract every `/images/...` reference from the six changed MDX files and assert that the target exists under the repository root. Check that `/reference/model-list` and `/zh/reference/model-list` use the correct language route.

- [ ] **Step 3: Scan for secrets and private data**

Run:

```powershell
rg -n --hidden -g '!*.png' 'sk-fk-[A-Za-z0-9_-]{12,}|11247|@shulex-tech\.com' guides zh/guides images/guides/cc-switch
```

Expected: no match. The documented placeholder `sk-fk-...` is allowed because it does not match the 12-character suffix rule.

- [ ] **Step 4: Validate structure and source JSON**

Run:

```powershell
$null = Get-Content -Raw -Encoding UTF8 docs.json | ConvertFrom-Json
git diff --check origin/main...HEAD
git status --short
```

Expected: JSON parses, no whitespace errors, and status contains only intentional work.

- [ ] **Step 5: Run Mintlify validation or preview**

Use the E-drive npm cache:

```powershell
$env:npm_config_cache='E:\workspace\.npm-cache'
npx --yes mint@4.2.715 validate
```

If the installed CLI version does not expose `validate`, run `npx --yes mint@4.2.715 dev`, load each of the six routes, and stop the preview after checking desktop and 390px-wide layouts. Record an explicit validation gap if the CLI download or local preview cannot run.

- [ ] **Step 6: Review the final scope**

Run:

```powershell
git diff --stat origin/main...HEAD
git diff --name-only origin/main...HEAD
```

Expected: only the design/plan documents, six guide pages, and twenty screenshot files.

- [ ] **Step 7: Create the final verification commit if validation caused changes**

Use a Lore-format message. `Tested:` must list the content contracts, image parity, secret scan, JSON parse, `git diff --check`, and Mintlify result or its exact gap.
