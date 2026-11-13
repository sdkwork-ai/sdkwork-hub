---
name: sdk-media-drive
description: Implement upload, download, and media resources through the Drive SDK. Use when an application stores, serves, or references user media.
---
# Media And Drive

## Inputs

- Selected Drive SDK family and package.
- Media type, size, and lifecycle.
- Existing upload surface and storage policy.

## Procedure

1. Select the Drive app or open SDK family from the catalog; do not build a custom upload client.
2. Create the upload through the generated Drive method and use its progress and resume semantics.
3. Store the returned `MediaResource` reference, not a local path or provider URL.
4. Apply the declared media validation: type, size, and retention.
5. Serve content through the Drive download contract, not direct provider access.
6. Add tests for upload, reference resolution, and one rejected file.

## Rules

- Do not call object-storage providers directly from application code.
- Do not duplicate upload logic in a business SDK or feature module.
- Do not store provider credentials in the client.
- Do not assume a file URL is permanent.

## Standards

- `../sdkwork-specs/DRIVE_SPEC.md`
- `../sdkwork-specs/MEDIA_RESOURCE_SPEC.md`
- `../sdkwork-specs/APP_ASSETS_SPEC.md` when the app owns capture or bundled assets
- `../sdkwork-specs/TEST_SPEC.md`

## Verification

```bash
node ../sdkwork-specs/tools/check-upload-declaration-standard.mjs --workspace ..
```
