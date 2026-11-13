---
name: sdk-integration-native
description: Integrate SDKWork SDKs into Android, iOS, HarmonyOS, and desktop native hosts. Use when a native application needs generated SDK packages and session bootstrap.
---
# Native SDK Integration

## Inputs

- Target platform and host architecture.
- Selected SDK card and native package coordinates.
- Existing bootstrap, keychain or keystore, and session handling.

## Procedure

1. Confirm the native package name, version, and repository channel from the SDK card.
2. Add the dependency through the platform package manager; do not vendor generated source.
3. Initialize the client at host bootstrap with base URL and a token provider backed by the platform secure store.
4. Keep SDK calls behind a repository or service boundary owned by the feature module.
5. Map errors to the platform failure model once.
6. Add one integration test per read and write path.

## Rules

- Never construct HTTP calls for an API the SDK covers.
- Never store tokens in plain application storage.
- Do not mix SDK generated models into UI state without an application model boundary.
- Follow exactly one native architecture spec for the platform.

## Standards

- `../sdkwork-specs/APP_ANDROID_NATIVE_UI_SPEC.md`
- `../sdkwork-specs/APP_IOS_NATIVE_UI_SPEC.md`
- `../sdkwork-specs/APP_HARMONY_NATIVE_UI_SPEC.md`
- `../sdkwork-specs/DESKTOP_APP_ARCHITECTURE_SPEC.md`
- `../sdkwork-specs/ANDROID_APP_MOBILE_ARCHITECTURE_SPEC.md` or `IOS_APP_MOBILE_ARCHITECTURE_SPEC.md`

## Verification

```bash
./gradlew test
xcodebuild test
hvigorw test
```
