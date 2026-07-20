# Flatkey Codex CC Switch screenshot guides implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the Claude Code pages to `origin/main` and finish four current-UI Codex CLI/Desktop guides with the 14 supplied English and Chinese screenshots.

**Architecture:** Keep the existing Mintlify routes and manual setup sections. Replace version-specific CC Switch prose with one current provider workflow shared conceptually by Codex CLI and Desktop, reuse provider screenshots between those pages, and keep product-specific verification images. Process only real user-supplied PNG files.

**Tech Stack:** Mintlify MDX, Markdown callouts and tables, PNG screenshot crops, ImageMagick or Pillow for lossless image processing, PowerShell validation, Git.

---

## File map

**Restore from `origin/main`:**

- `guides/claude-code.mdx`
- `zh/guides/claude-code.mdx`

**Modify:**

- `guides/codex-cli.mdx`
- `guides/codex-desktop.mdx`
- `zh/guides/codex-cli.mdx`
- `zh/guides/codex-desktop.mdx`

**Process and add:**

- `images/guides/cc-switch/en/codex-*.png`
- `images/guides/cc-switch/zh/codex-*.png`

Do not modify `docs.json`, navigation, global styles, or unrelated guides unless validation identifies a direct failure.

### Task 1: Restore Claude and lock the baseline

**Files:**

- Restore: `guides/claude-code.mdx`
- Restore: `zh/guides/claude-code.mdx`

- [ ] **Step 1: Restore both files without touching other work**

Run:

```powershell
git restore --source origin/main -- guides/claude-code.mdx zh/guides/claude-code.mdx
```

- [ ] **Step 2: Prove both files match the target**

Run:

```powershell
git diff --quiet origin/main -- guides/claude-code.mdx zh/guides/claude-code.mdx
if ($LASTEXITCODE -ne 0) { throw 'Claude pages do not match origin/main' }
```

Expected: exit code 0.

### Task 2: Inspect and sanitize the screenshot set

**Files:** Process all seven PNG files under each language directory.

- [ ] **Step 1: Record dimensions and inspect every image**

Use image metadata plus visual inspection. Confirm the language, endpoint, current field labels, active state, login-preservation state, and verification result.

- [ ] **Step 2: Crop English screenshots**

Keep only the relevant provider panel, form fields, model mapping controls, active card, setting, or verification conversation. In `codex-cli-verify.png`, exclude `C:\Users\11247` and the unrelated hooks parse error. In the provider form and model-mapping images, exclude unrelated provider/model dropdown content. In the Desktop verification image, remove unrelated sidebar conversations.

- [ ] **Step 3: Crop Chinese screenshots to matching content**

Use comparable framing where the source allows it. Remove any local path, account data, error, unrelated provider, or irrelevant navigation.

- [ ] **Step 4: Verify image parity and dimensions**

Run:

```powershell
$en = Get-ChildItem images/guides/cc-switch/en -Filter 'codex-*.png' | Sort-Object Name
$zh = Get-ChildItem images/guides/cc-switch/zh -Filter 'codex-*.png' | Sort-Object Name
if ($en.Count -ne 7 -or $zh.Count -ne 7) { throw 'Expected seven Codex screenshots per language' }
if (Compare-Object $en.Name $zh.Name) { throw 'English and Chinese screenshot filenames differ' }
```

Expected: seven files per language and no filename difference.

### Task 3: Update the Codex CLI guides

**Files:**

- Modify: `guides/codex-cli.mdx`
- Modify: `zh/guides/codex-cli.mdx`

- [ ] **Step 1: Align the English guide with the current UI**

Use the current field names **API Request URL**, **Default Model**, **Upstream Format**, **Model Mapping**, and **Fetch Models**. Use `https://router.flatkey.ai/v1` and **Responses (native)**. Tell readers to select an exact currently supported Flatkey model ID; the screenshot's `gpt-5.6-sol` value is an example, not a permanent requirement.

- [ ] **Step 2: Place five English images beside their steps**

Reference the provider list, provider form, model mapping, active provider, and CLI verification PNG files from `/images/guides/cc-switch/en/`.

- [ ] **Step 3: Apply the matching Chinese structure and images**

Use current Chinese UI labels from the screenshots and reference the five matching files under `/images/guides/cc-switch/zh/`.

- [ ] **Step 4: Remove version compatibility prose**

Remove fixed CC Switch version claims and older-version label caveats from both CLI pages. Keep the third-party disclaimer, restart step, Usage Logs verification, rollback, and troubleshooting sections.

### Task 4: Update the Codex Desktop guides

**Files:**

- Modify: `guides/codex-desktop.mdx`
- Modify: `zh/guides/codex-desktop.mdx`

- [ ] **Step 1: Align the shared provider workflow**

Use the same endpoint, Responses-native format, current field names, supported-model guidance, model-mapping explanation, activation, restart, Usage Logs verification, rollback, and troubleshooting contract as the CLI pages.

- [ ] **Step 2: Preserve the authentication boundary**

Explain the current official-login preservation setting shown in each language screenshot. State that readers must not copy, replace, or paste a Flatkey key into `auth.json`.

- [ ] **Step 3: Place six Desktop images per language**

Reference login preservation, provider list, provider form, model mapping, active provider, and Desktop verification images from the corresponding language directory.

- [ ] **Step 4: Remove version compatibility prose**

Remove fixed CC Switch version claims and older-version label caveats from both Desktop pages.

### Task 5: Verify the complete delivery

**Files:** All restored/modified MDX files and 14 PNG files.

- [ ] **Step 1: Verify Claude restoration and current-only wording**

Run:

```powershell
git diff --quiet origin/main -- guides/claude-code.mdx zh/guides/claude-code.mdx
if ($LASTEXITCODE -ne 0) { throw 'Claude pages differ from origin/main' }
rg -n 'v3\.17\.0|older versions|earlier versions|旧版本|较早版本|标签可能' guides/codex-cli.mdx guides/codex-desktop.mdx zh/guides/codex-cli.mdx zh/guides/codex-desktop.mdx
if ($LASTEXITCODE -eq 0) { throw 'Old-version compatibility wording remains' }
```

- [ ] **Step 2: Verify required content and image references**

Assert that all four pages contain `https://router.flatkey.ai/v1`, Responses guidance, restart, Usage Logs verification, rollback, and troubleshooting. Extract every `/images/` reference and assert that its repository-relative target exists.

- [ ] **Step 3: Scan text and images for private data**

Run a text scan for real-looking `sk-fk-` keys, `11247`, local paths, and known account identifiers. Visually inspect every final PNG at full resolution for the same data and for unrelated errors.

- [ ] **Step 4: Validate repository structure**

Run:

```powershell
$null = Get-Content -Raw -Encoding UTF8 docs.json | ConvertFrom-Json
git diff --check origin/main...HEAD
git diff --check
```

Expected: JSON parses and both diff checks produce no errors.

- [ ] **Step 5: Validate Mintlify rendering**

Run:

```powershell
$env:npm_config_cache='E:\workspace\.npm-cache'
npx --yes mint@4.2.715 validate
```

If that CLI release does not expose `validate`, run `npx --yes mint@4.2.715 dev`, load the four routes, inspect desktop and narrow widths, then stop the preview. Record an exact tooling gap if the CLI cannot run.

- [ ] **Step 6: Review scope and commit**

Confirm that the final diff contains only the two Claude restorations, four Codex pages, 14 Codex PNG files, and the revised design/plan. Commit with the repository Lore trailers and name every completed validation in `Tested:`.
