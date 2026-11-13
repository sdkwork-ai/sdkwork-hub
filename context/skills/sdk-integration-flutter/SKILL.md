---
name: sdk-integration-flutter
description: Integrate SDKWork SDKs into Flutter and Dart applications. Use when a Flutter app needs generated SDK packages, IAM bootstrap, auth, and error handling.
---
# Flutter SDK Integration

## Inputs

- Flutter application root and package layout.
- Selected SDK card and Flutter or Dart package names.
- Existing bootstrap and session handling.

## Procedure

1. Confirm the Flutter package name and version from the SDK card.
2. Add the package through the workspace or registry channel declared by the card.
3. Initialize the client once at application bootstrap; pass base URL and token provider through dependency injection.
4. Keep SDK calls in the data or service layer; widgets must not construct clients.
5. Map generated errors to the application failure model in one place.
6. Add a widget or integration test that exercises one read through the service layer.

## Rules

- Do not hand-edit generated Dart packages.
- Do not add a second HTTP client for an API the SDK already covers.
- Do not store tokens in widget state or shared preferences outside the approved session store.
- Use the Flutter package, not the Dart package, when both exist for the same family.

## Standards

- `../sdkwork-specs/APP_FLUTTER_UI_SPEC.md`
- `../sdkwork-specs/FLUTTER_APP_MOBILE_ARCHITECTURE_SPEC.md`
- `../sdkwork-specs/DART_CODE_SPEC.md`
- `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md`

## Verification

```bash
flutter analyze
flutter test
```
