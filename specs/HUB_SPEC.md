# SDKWork Hub Standard

- Version: 1.0
- Status: active
- Scope: hub purpose, boundaries, authority model, repository dictionary, operating modes, delivery phases
- Related: `README.md`, `LINK_SPEC.md`, `CATALOG_SPEC.md`, `CONTEXT_SPEC.md`, `VERIFICATION_SPEC.md`, `GOVERNANCE_SPEC.md`, `../sdkwork-specs/SOUL.md`, `../sdkwork-specs/AGENTS_SPEC.md`, `../sdkwork-specs/DOCUMENTATION_SPEC.md`, `../sdkwork-specs/SDK_SPEC.md`, `../sdkwork-specs/SDK_MANIFEST_SPEC.md`, `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`, `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`, `../sdkwork-specs/REPOSITORY_BASELINE_SPEC.md`

This standard defines what `sdkwork-hub` is, what it owns, and which repository is authoritative for each fact it publishes.

## 1. Purpose

Rules:

- The hub `MUST` be the single entry point for discovering and integrating SDKWork APIs and SDKs that are owned by independent repositories.
- The hub `MUST` pin SDK sources by gitlink and record the pin in `sdks/lock.json`.
- The hub `MUST` compile a derived catalog of SDK projects and API authorities from pinned source metadata.
- The hub `MUST` publish agent context (skills, references, recipes, blueprints, MCP) from the catalog.
- The hub `MUST NOT` vendor SDK source, generated SDK output, or OpenAPI authority documents into this repository.
- The hub `MUST NOT` generate, build, test, publish, deploy, or host SDKs. Those actions remain owned by the SDK-owning repository.

## 2. Non-Goals

- Not an application workspace or monorepo build root.
- Not an SDK generator front end, package registry, or artifact store.
- Not a second authority for SDK naming, ownership, packages, dependencies, or API contracts.
- Not a runtime service. The MCP server is a read-only projection of committed catalog artifacts.

## 3. Authority Model

The hub resolves a fact through exactly one chain and never invents above it:

```text
sdkwork-specs/*_SPEC.md                     global platform rules
  -> owner repository SDK family metadata   SDK facts SSOT
  -> catalog/                               derived projection of SDK facts
  -> context/ + mcp/                        agent-facing projection of catalog
```

Rules:

- `sdks/<sdk-family>/sdk-manifest.json` in the owner repository `MUST` remain the SDK facts SSOT. The hub `MUST NOT` accept a catalog value that cannot be derived from it or from the generated language packages it names.
- `catalog/` `MUST` record provenance for every SDK project and API authority: owner repository, source path, pinned commit, and source file SHA-256.
- When a catalog value and a source metadata value disagree, the source metadata wins and the catalog is stale. The fix is recompilation, never a catalog edit.
- The hub `MUST` cite global specs by relative path. It `MUST NOT` copy normative global rules into `specs/` or `context/`.

## 4. Repository Dictionary

| Path | Owner | Edit policy |
| --- | --- | --- |
| `specs/` | standards owner | Authored. Normative hub rules only. |
| `schemas/` | standards owner | Authored. One schema per generated artifact kind. |
| `sdks/` | link tool | Gitlinks plus `sdks/lock.json`. No authored source. |
| `catalog/` | compiler | Generated. Never hand-edited. |
| `context/skills/`, `context/recipes/`, `context/blueprints/`, `context/overrides/` | context owner | Authored. |
| `context/references/`, `context/index.json` | compiler | Generated. Never hand-edited. |
| `mcp/` | MCP owner | Authored. |
| `tools/` | tooling owner | Authored. |
| `examples/` | tooling owner | Authored minimal consumer snapshots. |
| `docs/` | documentation owner | Authored narrative per `DOCUMENTATION_SPEC.md`. |
| `.sdkwork/` | repository owner | Authored local skills, plugins, manifests. |

## 5. Operating Modes

| Mode | Sources materialized | Use |
| --- | --- | --- |
| `thin` | No | Default for agents and CI context jobs. Catalog and context are sufficient. |
| `linked` | Gitlinks under `sdks/` | Source inspection, compiler input, and verification. |

Rules:

- Catalog and context compilation `MUST NOT` require the workspace superproject `sdkwork-space`. They `MUST` run from this repository and its pins.
- Every mode `MUST` be verifiable against `sdks/lock.json`. A mismatch between a materialized checkout and its pin `MUST` fail verification.
- `thin` mode `MUST NOT` be described as lacking SDK data. The catalog is complete in thin mode; only source code is absent.

## 6. Generated And Authored Boundaries

Rules:

- Generated artifacts `MUST` carry `"generated": true`, a `generator` field, and the compiler version that wrote them.
- Generated artifact content `MUST` be deterministic: sorted keys, LF newlines, no timestamps inside per-entity files. `compiledAt` lives only in `catalog/index.json`.
- Authored files `MUST NOT` use the generated header.
- `context/overrides/<sdk-family>.md` is the only authored input merged into generated references. It `MUST` be merged by the compiler, not by hand.

## 7. Boundaries With Sibling Repositories

Rules:

- The hub `MUST NOT` write to `../sdkwork-specs` or to any SDK-owning repository.
- The hub `MAY` read a sibling SDK checkout only when it matches a pin in `sdks/lock.json`.
- SDK-owned facts that need correction `MUST` be fixed in the owner repository and then re-pinned by the hub.
- The hub repository is checked out inside `sdkwork-space`; the workspace superproject `MUST` treat it as an independent repository and `MUST NOT` track its files.

## 8. Delivery Phases

| Phase | Deliverable | Acceptance |
| --- | --- | --- |
| P0 | Baseline, six standards, schemas, verification harness | `node tools/hub.mjs verify` green |
| P1 | Gitlinks, lock, catalog compiler, 161 SDK projects, 104 API authorities | Clean clone reproduces the committed catalog |
| P2 | References, TypeScript recipes, initial skills, three blueprints, one example | Six golden tasks complete without source browsing |
| P3 | MCP server with ten tools and six resources | MCP contract tests green; no path escape |

Stage-2 SDK repository split is governed by `LINK_SPEC.md` section 6 and is not a P0-P3 precondition.

## 9. Verification

```bash
node tools/hub.mjs verify
node tools/hub.mjs info
```
