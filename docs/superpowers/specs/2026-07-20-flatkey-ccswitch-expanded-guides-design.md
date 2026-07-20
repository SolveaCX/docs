# Flatkey Codex CC Switch screenshot guide design

## Goal

Finish the English and Simplified Chinese CC Switch guides for Codex CLI and Codex Desktop using the user-supplied screenshots. Readers should be able to configure, activate, restart, verify, and roll back the current CC Switch workflow without relying on older-version compatibility notes.

## Scope

This delivery changes only:

- `guides/codex-cli.mdx`
- `guides/codex-desktop.mdx`
- `zh/guides/codex-cli.mdx`
- `zh/guides/codex-desktop.mdx`
- `images/guides/cc-switch/en/codex-*.png`
- `images/guides/cc-switch/zh/codex-*.png`
- this design and its implementation plan

The English and Chinese Claude Code pages are restored to their `origin/main` versions. Claude screenshots are excluded. No navigation or site-wide styling changes are planned.

## Documentation structure

Both Codex products use the same current CC Switch provider workflow:

1. Open the Codex provider panel.
2. Add Flatkey as a custom provider.
3. Enter the API request URL, key, default model, and upstream format.
4. Configure model mapping when needed.
5. Save and activate the provider.
6. Restart the relevant Codex client.
7. Send a minimal request and confirm the route in Flatkey Usage Logs.
8. Switch back to the official provider when needed.

The Desktop guide additionally explains official-login preservation and keeps `auth.json` outside the Flatkey API-key workflow.

## Current UI contract

The guide follows only the UI shown in the supplied screenshots. It does not name a CC Switch version and does not include wording such as “labels may differ in older versions.”

Use the current field names visible in the UI:

- **API Request URL**: `https://router.flatkey.ai/v1`
- **Default Model**: an exact supported Flatkey model ID
- **Upstream Format**: **Responses (native)** in English and the corresponding current Chinese label
- **Model Mapping**
- **Fetch Models**

The screenshots currently show `gpt-5.6-sol`. The prose may use that value as the pictured example, but must direct readers to choose an exact model ID currently available from Flatkey rather than promise that one model ID is permanent.

## Screenshot set

Each language has seven supplied PNG files:

- `codex-provider-list.png`
- `codex-provider-form.png`
- `codex-model-mapping.png`
- `codex-provider-active.png`
- `codex-login-preservation.png`
- `codex-cli-verify.png`
- `codex-desktop-verify.png`

The same provider screenshots may appear in both the CLI and Desktop guides. Each product uses its own verification screenshot.

Before inclusion, crop each image to the relevant application region. Remove local usernames, paths, unrelated errors, unrelated providers, account data, and irrelevant navigation. Do not fabricate or regenerate the product UI. Preserve enough surrounding context for the named control and current state to be understandable.

## Content and safety boundaries

- Describe CC Switch as a third-party tool.
- Do not claim Flatkey is a built-in CC Switch preset.
- Do not expose a real Flatkey API key.
- Keep `https://router.flatkey.ai/v1` and the Responses-native format consistent across both Codex products.
- Do not require Local Routing for Flatkey's native Responses path.
- Do not instruct Codex Desktop users to copy, replace, or paste a Flatkey key into `auth.json`.
- Treat the current provider state and Flatkey Usage Logs as the routing evidence.
- Keep manual configuration instructions already present on the four pages unless they conflict with the current CC Switch workflow.

## Validation

Completion requires:

- the two Claude Code pages match `origin/main`;
- all 14 Codex images exist with English/Chinese filename parity;
- every image reference resolves;
- screenshots contain no visible username, local path, real secret, or unrelated error;
- the four pages contain the current endpoint, Responses-native format, restart, verification, rollback, and troubleshooting guidance;
- no fixed CC Switch version or old-version compatibility wording remains in the four Codex pages;
- `docs.json` parses;
- `git diff --check` passes;
- Mintlify validation or a local preview succeeds, with any tooling gap reported explicitly.
