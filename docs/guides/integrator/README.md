# Integrator Guide

## Choose And Integrate An SDK

1. Start with `../../context/skills/sdkwork-hub/SKILL.md`.
2. Select the SDK with `sdk-selection`.
3. Load the SDK card from `catalog/sdks/<sdk-family>.json` (or `sdk_get` via MCP).
4. Load the matching platform skill and the exact recipes named by the card.
5. Assemble with the matching blueprint from `../../context/blueprints/`.
6. Run the completion proof named by the blueprint.

## Rules

- Add consumer packages only.
- Never import generated transport packages or deep generated paths.
- Never replace a missing SDK operation with raw HTTP.
- Cite global specs, not hub summaries, in design documents.
