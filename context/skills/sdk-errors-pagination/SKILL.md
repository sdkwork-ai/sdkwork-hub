---
name: sdk-errors-pagination
description: Handle SDKWork response envelopes, problem details, pagination, idempotency, and retries. Use when mapping SDK results and failures into an application.
---
# Errors And Pagination

## Inputs

- SDK card envelope and error model.
- Operation list and pagination style.
- Application failure model and retry policy.

## Procedure

1. Unwrap the standard envelope once in the service layer.
2. Map problem details to the application error type, preserving status, code, request id, and field errors.
3. Classify retryable failures: network, rate limit, and server errors. Never retry non-idempotent writes without an idempotency key.
4. Implement pagination using the declared cursor or page model; stop on an empty page or absent cursor.
5. Preserve request ids in logs and user-visible diagnostics where the platform requires them.
6. Add tests for one success, one client error, one retryable error, and one paginated traversal.

## Rules

- Do not surface raw generated error types to UI.
- Do not retry an operation whose contract declares no safe retry.
- Do not hard-code page sizes outside the API contract.
- Do not swallow envelope errors and continue as success.

## Standards

- `../sdkwork-specs/API_SPEC.md` sections on envelope and problem details
- `../sdkwork-specs/PAGINATION_SPEC.md`
- `../sdkwork-specs/TEST_SPEC.md`

## Verification

```bash
node ../sdkwork-specs/tools/check-api-response-envelope.mjs --workspace ..
node ../sdkwork-specs/tools/check-pagination.mjs --workspace ..
```
