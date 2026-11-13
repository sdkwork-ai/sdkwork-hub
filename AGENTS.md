# Repository Guidelines

## SDKWORK Soul

Read `../sdkwork-specs/SOUL.md` before changing anything in this repository. It governs agent behavior, ambiguity handling, task-scoped checkpoints, and verification. Load only the sections that route the current task.

## SDKWORK Standards

This is a standards and tooling repository, not an SDKWork application. It owns the repository-local hub standards under `specs/` and the generated context artifacts under `catalog/` and `context/`.

Canonical global standards path from this repository:

- `../sdkwork-specs/README.md`
- `../sdkwork-specs/SOUL.md`
- `../sdkwork-specs/AGENTS_SPEC.md`
- `../sdkwork-specs/DOCUMENTATION_SPEC.md`
- `../sdkwork-specs/SDK_SPEC.md`
- `../sdkwork-specs/SDK_MANIFEST_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`
- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/REPOSITORY_BASELINE_SPEC.md`

If the relative path to `sdkwork-specs` does not resolve, stop and report the unresolved path. Do not continue with a guessed standard.

Managed sync blocks such as `SDKWORK-SDK-GENERATION-STANDARD`, `SDKWORK-DESTRUCTIVE-OPERATION-STANDARD`, `SDKWORK-ROLLBACK-RESTRICTION-STANDARD`, and `SDKWORK-MAIN-BRANCH-STANDARD` are written only by their canonical sync tools under `sdkwork-specs/tools`. This file intentionally carries no hand-written copy; run the canonical sync tools to materialize the blocks.

## Application Identity

This repository is the SDKWork API and SDK hub. It has no runtime application identity, no `agent.app.config.json`, and no deployable application surface.

Its product behavior is described by `docs/product/prd/PRD.md`; its technical boundaries are described by `docs/architecture/tech/TECH_ARCHITECTURE.md`.

## Local Dictionary Structure

- `AGENTS.md`: agent execution rules for this repository.
- `CLAUDE.md`, `GEMINI.md`, `CODEX.md`: compatibility shims that point to `AGENTS.md`.
- `README.md`: repository entry, layout, and quick start.
- `specs/`: repository-local normative standards.
- `schemas/`: JSON schemas for every generated artifact.
- `sdks/`: gitlinks to SDK-owning repositories plus `sdks/lock.json`.
- `catalog/`: derived, read-only catalog. Never edit by hand.
- `context/`: agent skills, references, recipes, and blueprints.
- `mcp/`: `@sdkwork/hub-mcp`, the read-only MCP server.
- `tools/`: `@sdkwork/hub-cli`.
- `examples/`: minimal consumer snapshots used for verification.
- `.sdkwork/`: repository-local skills, plugins, and workspace manifests.
- `docs/`: documentation Canon. Read `docs/README.md` first.

## Spec Resolution Order

1. This `AGENTS.md`.
2. `specs/README.md`, then only the hub spec that matches the task.
3. `../sdkwork-specs/SOUL.md` and the task-specific global spec selected by its task matrix.
4. `.sdkwork/README.md`, then only the local skill whose declared trigger matches.
5. Generated artifact schema in `schemas/` and the compiler code under `tools/`.
6. Implementation files.

Local files may narrow a task. Global standards remain authoritative.

## Required Specs By Task Type

| Task | Read before editing |
| --- | --- |
| Repository entry, CI, baseline files | `AGENTS_SPEC.md`, `SDKWORK_WORKSPACE_SPEC.md`, `DOCUMENTATION_SPEC.md`, `REPOSITORY_BASELINE_SPEC.md`, `specs/HUB_SPEC.md` |
| Gitlink, pin, lock, sparse checkout | `specs/LINK_SPEC.md`, `specs/VERIFICATION_SPEC.md`, `DEPENDENCY_MANAGEMENT_SPEC.md` |
| Catalog entity or compiler change | `specs/CATALOG_SPEC.md`, `schemas/`, `SDK_SPEC.md`, `SDK_MANIFEST_SPEC.md` |
| Skills, references, recipes, blueprints, MCP | `specs/CONTEXT_SPEC.md`, `specs/GOVERNANCE_SPEC.md`, `AGENTS_SPEC.md` |
| Verification or gate change | `specs/VERIFICATION_SPEC.md`, `TEST_SPEC.md`, `QUALITY_GATE_SPEC.md` |
| Standard, policy, or directory change | `specs/GOVERNANCE_SPEC.md`, `ARCHITECTURE_DECISION_SPEC.md` |
| Documentation | `DOCUMENTATION_SPEC.md`, `docs/README.md` |

## Code Style Rules

- Node.js ESM only. No transpile step for `tools/`; it must run on the current Node LTS.
- `tools/` has zero runtime dependencies unless a standard explicitly approves one.
- All JSON artifacts use LF newlines and deterministic key order written by the compiler.
- Never hand-edit `catalog/` or generated sections of `context/`. Regenerate and commit.
- Never vendor SDK source or generated SDK output into this repository.

## Build, Test, and Verification

```bash
node tools/hub.mjs verify
node tools/hub.mjs info
node --test
```

`verify` is the mandatory pre-commit and CI gate. A change is incomplete until `verify` passes with zero violations.

## Agent Execution Rules

- Resolve the task surface before reading files: link, catalog, context, MCP, or docs.
- Do not scan `sdks/` or the whole workspace to answer a catalog question; read the catalog.
- Do not modify `../sdkwork-specs` or sibling repositories from this repository.
- Do not run `git submodule update` across the whole superproject; link one repository at a time through `hub link`.
- Do not hand-edit generated artifacts. Fix the compiler or the source metadata, then recompile.
- Report unresolved authority paths or stale catalogs instead of guessing.

## App SDK Consumer Imports

This repository does not compile or consume SDK client code at runtime; it indexes SDK metadata and documents consumption. Consumer import rules are owned by `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md` section 9 and must be cited, never restated, in hub recipes.

## HTTP API Response Envelope

This repository does not serve HTTP APIs. API response-envelope rules are owned by `../sdkwork-specs/API_SPEC.md`; the catalog records operation metadata only.

## Human Review Rules

- Generated artifact changes require the compiler version and `compiledAt` to be explained in the change description.
- Link pin changes require the target commit and the reason (release train, security fix, incident) in the change description.
- Standard changes require an ADR under `docs/architecture/decisions/`.
- No review is complete until `node tools/hub.mjs verify` is green.
