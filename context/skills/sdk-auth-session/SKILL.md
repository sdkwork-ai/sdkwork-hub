---
name: sdk-auth-session
description: Wire tokens, sessions, IAM bootstrap, and credential entry into SDKWork SDK clients. Use when an integration needs login, refresh, access tokens, or credential-entry bootstrap.
---
# Auth And Session

## Inputs

- Selected SDK card and its declared auth modes.
- IAM integration state: login, session, refresh, or bootstrap.
- Token storage and distribution mechanism.

## Procedure

1. Read the auth modes from the SDK card and the authority operation metadata.
2. Choose one token source: user session, access token, API key, OAuth credential, or credential-entry bootstrap.
3. Centralize token acquisition and refresh in the TokenManager of the runtime.
4. Pass a token provider into the SDK transport; never set headers per call.
5. For credential-entry bootstrap, fail before dispatch when the bootstrap token is absent.
6. For refresh-token operations, send only the declared refresh proof.
7. Verify with one successful and one rejected call.

## Rules

- Anonymous operations must suppress all stored credentials and context projection headers.
- Never log a token, refresh token, cookie, or authorization header.
- Never reuse an app login token for an OAuth relying-party client.
- Never bypass the TokenManager with a local cache.

## Standards

- `../sdkwork-specs/IAM_LOGIN_INTEGRATION_SPEC.md`
- `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md`
- `../sdkwork-specs/APP_ACCESS_TOKEN_SPEC.md`
- `../sdkwork-specs/IAM_APPLICATION_BOOTSTRAP_SPEC.md`
- `../sdkwork-specs/SECURITY_SPEC.md`

## Verification

```bash
node ../sdkwork-specs/tools/audit-app-iam-integration.mjs --workspace ..
node ../sdkwork-specs/tools/check-credential-entry-bootstrap-standard.mjs --workspace ..
```
