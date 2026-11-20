---
name: sdk-version-upgrade
description: Upgrade an SDKWork release train and handle breaking SDK and API changes. Use when moving to a newer train, replacing a deprecated SDK, or reviewing version alignment.
---
# Version Upgrade

## Inputs

- Current train or package versions.
- Target train or target pins.
- Affected applications, surfaces, and blueprints.

## Procedure

1. Read the current and target train entries and the changed pins.
2. Build the impact list: changed SDK families, changed operations, changed packages, deprecated operations.
3. Classify changes as additive, behavioral, or breaking.
4. Update consumer packages in dependency order: foundation, appbase and IAM, domain SDKs, application code.
5. Update the application service layer for renamed operations and changed envelopes.
6. Run the application verification suite plus the hub context checks.
7. Record the upgrade in the application changelog and, when a boundary changed, in the hub release evidence.

## Rules

- Do not mix a train upgrade with unrelated feature work.
- Do not pin a branch. Use a train version or a commit.
- Do not skip a breaking change review because the package version is a patch.
- A downgrade requires an explicit governed exception.

## Standards

- `../specs/CATALOG_SPEC.md` section 6
- `../specs/GOVERNANCE_SPEC.md` section 9
- `../sdkwork-specs/RELEASE_SPEC.md`
- `../sdkwork-specs/MIGRATION_SPEC.md`
- `../sdkwork-specs/DEPENDENCY_MANAGEMENT_SPEC.md`

## Verification

```bash
node tools/hub.mjs verify
node ../sdkwork-specs/tools/check-dependency-list-completeness.mjs --root .
```
