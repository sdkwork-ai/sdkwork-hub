---
name: sdk-integration-backend
description: Consume SDKWork SDKs from Rust, Java, Go, or Node services. Use when a backend service calls an SDKWork API through a generated SDK package.
---
# Backend SDK Integration

## Inputs

- Service language and runtime.
- Selected SDK card, authority, and package coordinates.
- Service identity and credential source.

## Procedure

1. Confirm the language package and its release channel from the SDK card.
2. Add the package through the build system used by the service.
3. Create one client owner per authority; do not construct clients per request.
4. Resolve base URL and service credentials from the service configuration model.
5. Map the SDK problem model to the service error type once.
6. Configure timeouts, retries, and idempotency according to the API contract.
7. Add a contract test that calls a read-only operation against a test authority.

## Rules

- A service must not call app-only endpoints.
- Do not generate a local OpenAPI client when a family SDK exists.
- Do not copy DTOs; consume SDK models at the boundary and map to service models.
- Do not log tokens, cookies, or request bodies that carry credentials.

## Standards

- `../sdkwork-specs/SDK_SPEC.md` section 1
- `../sdkwork-specs/RPC_SPEC.md` when an RPC family is used
- `../sdkwork-specs/RUST_CODE_SPEC.md`, `JAVA_CODE_SPEC.md`, `TYPESCRIPT_CODE_SPEC.md`, or `../sdkwork-specs/WEB_BACKEND_SPEC.md` as applicable
- `../sdkwork-specs/TEST_SPEC.md`

## Verification

```bash
cargo test
./gradlew test
go test ./...
pnpm test
```
