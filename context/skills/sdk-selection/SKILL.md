---
name: sdk-selection
description: Choose the right SDKWork SDK families, surfaces, and languages for an application goal. Use before adding a dependency, designing an integration, or reviewing an SDK choice.
---
# SDK Selection

## Inputs

- Capability goal and user scenario.
- Consumer type: end-user client, admin console, trusted first party, third party, or service.
- Target languages and runtime.
- Existing dependencies and surfaces already in use.

## Procedure

1. Map the capability to a domain family from the catalog.
2. Select the surface:
   - End-user app or desktop client: `app`.
   - Admin and operator console: `backend`.
   - Third-party integration or OAuth relying party: `open`.
   - Trusted in-app automation on the application ingress: `internal`.
   - Service-to-service: `rpc`.
   - Non-HTTP provider or runtime SDK: `provider-runtime` or `language-native`.
3. Select the language package that the catalog marks as consumable at L2 or L3.
4. Reject a candidate whose maturity is below L2 unless the task is explicitly exploratory.
5. Record the family, package names, authority, and prefix in the plan.

## Rules

- App-facing UI must not call backend SDKs or `/backend/v3/api`.
- Backend SDKs must not depend on app UI packages or user-facing shell runtime.
- Prefer one family per authority. Do not compose two families for the same capability.
- Do not select a transport package as a dependency.
- Cite `dependencyApiExports` when a family re-exports another family's capability.

## Standards

- `../specs/CATALOG_SPEC.md` sections 1 and 3
- `../sdkwork-specs/SDK_SPEC.md` section 1
- `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md` section 9
- `../sdkwork-specs/COMPOSABLE_ARCHITECTURE_SPEC.md`

## Verification

```bash
node tools/hub.mjs catalog check
```
