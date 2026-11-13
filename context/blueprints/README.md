# Blueprints

Application assembly guides. Each blueprint composes existing platform standards for one application type and links the recipes and SDK references it requires.

## Required Set

`pc-react`, `h5`, `mobile-react`, `flutter`, `mini-program`, `android-native`, `ios-native`, `harmony-native`, `desktop-tauri`, `backend-service`.

## Structure

1. Technology selection and owned specs
2. Layering: shell, composition, service-SDK, UI
3. SDK assembly order and surfaces
4. Bootstrap: base URL, TokenManager, IAM
5. Errors, pagination, i18n
6. Upload and media
7. Testing and verification
8. Anti-patterns

## Rules

- A blueprint composes standards; it never introduces architecture.
- A blueprint links exact recipes and SDK cards.
- A blueprint names the completion proof for each integration step.

Read [../specs/CONTEXT_SPEC.md](../specs/CONTEXT_SPEC.md) section 5.
