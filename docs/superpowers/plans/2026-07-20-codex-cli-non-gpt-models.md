# Codex CLI non-GPT model guidance implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Explain in both Codex CLI guides how to select compatible Claude, Gemini, and other non-GPT text models through Flatkey.

**Architecture:** Keep the existing guide structure and expand the introduction, CC Switch model configuration, and model-selection section in place. Preserve exact model IDs and commands across languages while localizing the surrounding explanation.

**Tech Stack:** Mintlify MDX, Markdown, repository reference-style validator

---

### Task 1: Update the English Codex CLI guide

**Files:**
- Modify: `guides/codex-cli.mdx`

- [ ] **Step 1: Expand the page description and introduction**

Replace the GPT-only description with wording that covers compatible GPT, Claude, Gemini, and other text models routed through Flatkey. Keep the discounted-routing benefit without promising permanent availability for a specific model.

- [ ] **Step 2: Clarify the three model controls in CC Switch step 4**

State that:

```text
Default Model: used for a new session when no explicit model is passed.
Model Mapping: controls entries shown in /model; it does not rename a model or make it compatible.
codex --model <id>: sends an exact model ID for that invocation without requiring a /model entry.
```

Use `claude-sonnet-4-6` and `gemini-2.5-flash` as non-GPT examples and direct readers to `/reference/model-list` for current IDs.

- [ ] **Step 3: Replace the GPT-only command examples**

Use this command block:

```bash
codex --model gpt-5.4 "Review this change"
codex --model claude-sonnet-4-6 "Review this change"
codex --model gemini-2.5-flash "Review this change"
```

Explain that the model must be a text-generation model available through Flatkey and compatible with the Codex request format. Exclude image, audio, and embedding models. Make Usage Logs the authoritative check for the model that served the request.

### Task 2: Mirror the guidance in Chinese

**Files:**
- Modify: `zh/guides/codex-cli.mdx`

- [ ] **Step 1: Expand the Chinese page description and introduction**

Use concise Chinese wording that states Codex CLI can use compatible GPT、Claude、Gemini 等文本模型 through Flatkey.

- [ ] **Step 2: Explain the three controls in Chinese CC Switch step 4**

Describe **默认模型**、**模型映射** and `codex --model <id>` with the same behavior and limitations as the English page. Preserve exact UI labels, command names, model IDs, and the `/zh/reference/model-list` link.

- [ ] **Step 3: Add matching Chinese command examples and limits**

Use the same three commands as the English page. Explain that non-GPT IDs are passed directly to Flatkey, `/model` visibility is optional, image/audio/embedding models are excluded, and the Chinese Usage Logs route is the authoritative verification source.

### Task 3: Validate and publish

**Files:**
- Verify: `guides/codex-cli.mdx`
- Verify: `zh/guides/codex-cli.mdx`
- Verify: `docs/superpowers/specs/2026-07-20-codex-cli-non-gpt-models-design.md`
- Verify: `docs/superpowers/plans/2026-07-20-codex-cli-non-gpt-models.md`

- [ ] **Step 1: Run static validation**

Run:

```powershell
git diff --check
node tests/validate-reference-style.mjs
```

Expected: no whitespace errors and `Reference style contract validated for 56 routes.`

- [ ] **Step 2: Verify bilingual content parity**

Run focused searches for `claude-sonnet-4-6`, `gemini-2.5-flash`, `Model Mapping`, `模型映射`, and the two Usage Logs URLs. Expected: both guides contain the examples, semantics, limitations, and verification links.

- [ ] **Step 3: Commit, push, and merge through a pull request**

Commit the plan and bilingual guide changes using the repository Lore commit protocol, push the branch, open a ready pull request, verify it is mergeable, and squash-merge it with a Lore-compliant message.

- [ ] **Step 4: Publish through Mintlify**

Open the Flatkey Mintlify Activity page, trigger **Manual update**, and wait for **Successful** because automatic GitHub App deployment is currently unavailable.

- [ ] **Step 5: Verify production**

Request both live guide routes with cache-busting query parameters. Expected: HTTP 200 and both responses contain `claude-sonnet-4-6` and `gemini-2.5-flash`.
