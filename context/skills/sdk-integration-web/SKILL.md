---
name: sdk-integration-web
description: Integrate SDKWork SDKs into React, Vue, H5, or mini-program clients. Use when a browser client needs SDK clients, IAM bootstrap, auth, error mapping, and pagination.
---
# Web SDK Integration

## Inputs

- Application root and architecture (`pc-react`, `h5`, `mobile-react`, or `mini-program`).
- Selected SDK card and consumer package names.
- Existing bootstrap, TokenManager, and service layer.

## Procedure

1. Confirm the consumer package name and version from the SDK card. Add only consumer packages to `dependencies`.
2. Create or extend the service layer that owns SDK clients; UI must not construct clients inline.
3. Wire base URL resolution through the standard runtime environment.
4. Wire the token provider through the shared TokenManager; never read tokens in components.
5. Map the SDK error envelope to the application problem model once, in the service layer.
6. Implement pagination with the standard cursor or page model.
7. Add a contract test that exercises one read and one write through the service layer.

## Rules

- Import only the consumer package, never the generated transport package or deep generated paths.
- Do not register `generated/server-openapi` in a workspace.
- Do not call backend SDKs from user-facing UI.
- Do not replace a missing SDK method with raw HTTP.
- Follow exactly one detailed UI architecture spec for the app type.

## Standards

- `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md` section 9
- `../sdkwork-specs/FRONTEND_SPEC.md`
- `../sdkwork-specs/APP_PC_ARCHITECTURE_SPEC.md` or `APP_H5_ARCHITECTURE_SPEC.md`
- `../sdkwork-specs/UI_ARCHITECTURE_SPEC.md`
- `../sdkwork-specs/TEST_SPEC.md`

## Verification

```bash
node ../sdkwork-specs/tools/check-app-sdk-consumer-imports.mjs --workspace ..
node ../sdkwork-specs/tools/check-workspace-layout.mjs --root .
```
