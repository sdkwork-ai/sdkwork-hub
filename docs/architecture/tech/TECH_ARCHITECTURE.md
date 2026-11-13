# SDKWork Hub Technical Architecture

Status: active
Owner: SDKWork platform
Updated: 2026-11-13
Specs: HUB_SPEC.md, LINK_SPEC.md, CATALOG_SPEC.md, CONTEXT_SPEC.md, VERIFICATION_SPEC.md, GOVERNANCE_SPEC.md

## 1. Architecture Overview

The hub is a compile-and-publish layer, not a runtime service.

```text
independent SDK repositories
  -> gitlinks + lock pins (sdks/)
  -> catalog compiler (tools/)
  -> catalog artifacts (catalog/)
  -> context compiler (tools/)
  -> skills, references, recipes, blueprints (context/)
  -> read-only MCP server (mcp/)
```

Each stage is a deterministic transformation over committed inputs. A stage never mutates its input authority.

## 2. Technology Choices

| Choice | Reason |
| --- | --- |
| Node.js ESM for `tools/` | Runs on the platform's Node LTS with no transpile step and no runtime dependencies |
| JSON artifacts + JSON Schema | Diffable, validatable, tool-agnostic |
| Markdown context | Native to agents and review |
| MCP over stdio | Lowest-friction agent integration; optional HTTP for hosting |
| Git submodules | Only mechanism that pins an exact repository commit at a path |

The hub deliberately avoids YAML parsing for authority documents in P0. OpenAPI YAML support is added with an approved parser dependency in P1.

## 3. System Boundaries And Modules

| Module | Boundary |
| --- | --- |
| `sdks/` | Source provenance only. Gitlinks plus lock. |
| `catalog/` | Derived SDK and API facts. Read-only. |
| `context/` | Agent-facing procedures and compiled references. |
| `mcp/` | Read-only query surface over `catalog/` and `context/`. |
| `tools/` | Link management, compilation, verification. |
| `docs/` | Human narrative and evidence. |
| `specs/` | Normative hub rules. |

## 4. Directory And Package Layout

```text
sdkwork-hub/
  sdks/            gitlinks + lock.json
  catalog/         derived index
  context/         skills / references / recipes / blueprints
  mcp/             @sdkwork/hub-mcp
  tools/           @sdkwork/hub-cli
  specs/           six standards
  schemas/         artifact schemas
  examples/        consumer fixtures
  docs/            documentation Canon
```

Packages are `@sdkwork/hub-cli` and `@sdkwork/hub-mcp`. The repository root package is private and only aggregates scripts.

## 5. API, SDK, And Data Ownership

- SDK facts are owned by each family's `sdk-manifest.json` and `specs/component.spec.json` in its repository.
- API operations are owned by the authority OpenAPI document in the same repository.
- The hub owns only the projection: catalog shape, maturity assignment, context budgets, and MCP contract.
- The hub stores no user data, credentials, or runtime state.

## 6. Security, Privacy, And Observability

- Read-only by construction: `verify` and the MCP server do not write.
- `doc_read` is allowlisted to `specs/`, `context/`, and `docs/`.
- No secrets, tokens, or machine-local paths in tracked files; the hygiene gate enforces this.
- Observability is the verification report and the catalog `compiledAt`/`pinsDigest` pair. There is no telemetry endpoint.

## 7. Deployment And Runtime Topology

- No application runtime.
- CI runs verification on every change and link checks nightly.
- The MCP server runs as a local stdio process for agents; an optional HTTP deployment is governed separately.

## 8. Architecture Decision Index

- [ADR-0001: Link Granularity](../decisions/ADR-0001-link-granularity.md)
- [ADR-0002: Two-Stage Source Model](../decisions/ADR-0002-two-stage-source-model.md)
- [ADR-0003: Single SDK Namespace](../decisions/ADR-0003-single-sdk-namespace.md)

## 9. Verification

```bash
node tools/hub.mjs verify
node --test
```
