---
name: sdkwork-hub
description: Route SDKWork SDK and API work through the hub catalog, skills, and MCP server. Use at the start of any SDK discovery, integration, upgrade, or review task in an SDKWork application.
---
# SDKWork Hub

## Use When

- A task needs to discover which SDKWork SDK or API provides a capability.
- A task plans, reviews, or upgrades an SDK integration.
- A task needs package names, auth modes, operations, or verification commands.

## Inputs

- The application goal and target platform.
- Allowed API surfaces: app, backend, open, internal, or rpc.
- Target languages.

## Procedure

1. Classify the request as discovery, integration, upgrade, or review.
2. Read the catalog summary from `catalog/index.json` or call `sdk_search`.
3. Select one SDK card with `sdk_get`; do not scan `sdks/` for metadata.
4. Load the matching integration skill and the exact recipes named by the card.
5. Produce a plan that names packages, bootstrap, auth, error handling, and verification.
6. Run the verification command named by the plan.

## Rules

- Treat `catalog/` as read-only. Never answer with a fact absent from the catalog.
- Report `stale_catalog` when the MCP response says the catalog is stale.
- Prefer a composed consumer package over generated transport imports.
- Do not invent operations. If an operation is absent, say so and cite the authority.

## Standards

- `../specs/HUB_SPEC.md`
- `../specs/CONTEXT_SPEC.md`
- `../sdkwork-specs/SDK_SPEC.md`
- `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md`

## Verification

```bash
node tools/hub.mjs verify
node tools/hub.mjs info
```
