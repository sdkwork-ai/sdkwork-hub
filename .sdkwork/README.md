# .sdkwork

Repository-local workspace metadata for `sdkwork-hub`, governed by `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`.

## Purpose

This directory stores hub-maintenance skills, plugins, and the workspace manifest. It does not store SDK source, generated catalog artifacts, or application runtime data.

## Authoritative Paths

- `skills/`: procedures for maintaining the hub. Start at `skills/README.md`.
- `plugins/`: repository-local plugin bundles. Start at `plugins/README.md`.
- `manifests/workspace.json`: machine-readable workspace identity.

Agent-facing SDK consumption skills are published from `../context/skills/`, not from here. This directory owns how the hub itself is maintained.
