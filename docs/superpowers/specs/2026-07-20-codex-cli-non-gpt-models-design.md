# Codex CLI non-GPT model guidance design

## Goal

Make the English and Chinese Codex CLI guides explain how to use compatible non-GPT text models through Flatkey without implying that Codex CLI is limited to GPT models.

## Scope

Update only these two pages:

- `guides/codex-cli.mdx`
- `zh/guides/codex-cli.mdx`

No screenshots, navigation, model-directory entries, or other guides will change.

## Content design

### Page introduction

Revise the frontmatter description and opening paragraph so each page states that the Flatkey configuration can route Codex CLI requests to compatible GPT, Claude, Gemini, and other text models. Keep the claim bounded to models currently available through Flatkey and compatible with the Codex CLI request format.

### CC Switch model configuration

Expand step 4 to distinguish three controls:

1. **Default Model** controls the model used when a new Codex session starts without an explicit model argument.
2. **Model Mapping** controls which entries appear in the Codex `/model` menu. It is optional when the user already knows the exact model ID.
3. `codex --model <id>` passes an exact model ID for that invocation and does not require the model to appear in `/model`.

Use `claude-sonnet-4-6` and `gemini-2.5-flash` as concrete non-GPT examples because both IDs are present in the current Flatkey model directory. Explain that users should copy current IDs from the model directory instead of treating examples as a permanent availability guarantee.

### Choosing a model

Replace the GPT-only examples with one GPT example and two non-GPT examples:

```bash
codex --model gpt-5.4 "Review this change"
codex --model claude-sonnet-4-6 "Review this change"
codex --model gemini-2.5-flash "Review this change"
```

State that text-generation models may be used when Flatkey exposes them through a Codex-compatible endpoint. Image, audio, and embedding models are outside this workflow. The Flatkey Usage Logs entry is the authoritative check for the model that handled the request.

## Language parity

The English and Chinese pages will carry the same behavior, examples, limitations, and verification instructions. The Chinese page will use concise Chinese UI explanations while preserving exact command names and model IDs.

## Validation

- Run `git diff --check`.
- Run `node tests/validate-reference-style.mjs` and require all documented routes to pass.
- Confirm both pages contain the three model examples and link to the corresponding model directory and Usage Logs.
- Review the final diff to confirm that no files outside the two guides and this design artifact changed.
- After merge, run Mintlify **Manual update** because the GitHub App automatic deployment is currently unavailable.
- Verify both live routes return HTTP 200 and contain the new Claude and Gemini examples.

## Publication

Commit the bilingual guide update on the current branch, push it, open a pull request, merge after validation, trigger Mintlify **Manual update**, and verify the live English and Chinese pages.
