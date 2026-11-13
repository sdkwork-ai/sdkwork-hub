# sdkwork-hub

repository-kind: standards

SDKWork API and SDK hub. The hub is a derived context layer over the independent SDK-owning repositories of the SDKWork workspace: it pins SDK sources by gitlink, compiles a read-only catalog of SDK projects and API authorities, and publishes agent context through skills and an MCP server.

The hub does not generate, build, publish, or host SDKs. Each SDK family remains owned by its repository, and `sdks/<sdk-family>/sdk-manifest.json` in that repository remains the single source of truth for SDK facts.

## Responsibilities

| Layer | Path | Responsibility |
| --- | --- | --- |
| Links | `sdks/` | Gitlinks to SDK-owning repositories plus `sdks/lock.json` pins |
| Catalog | `catalog/` | Derived, read-only index of SDK projects, API authorities, and operations |
| Context | `context/` | Agent skills, per-SDK references, language recipes, app blueprints |
| Agent surface | `mcp/` | `@sdkwork/hub-mcp` read-only MCP server over the catalog |
| Standards | `specs/` | Repository-local normative standards for the hub |
| Tooling | `tools/` | `@sdkwork/hub-cli`: link, catalog, context, verify, plan |

## Layout

```text
sdkwork-hub/
  sdks/                 # gitlinks + lock.json
  catalog/              # derived index (committed, CI-verified)
  context/              # skills / references / recipes / blueprints
  mcp/                  # @sdkwork/hub-mcp
  tools/                # @sdkwork/hub-cli
  specs/                # hub standards
  schemas/              # JSON schemas for generated artifacts
  examples/             # minimal consumer snapshots
  docs/                 # documentation Canon
```

## Quick start

```bash
node tools/hub.mjs verify     # repository and generated-artifact checks
node tools/hub.mjs info       # catalog and pin summary
node tools/hub.mjs link list  # pinned repositories
```

## Authority

Global platform standards live in the sibling `sdkwork-specs/` repository and are cited by relative path. This repository must not copy or weaken them.

- `../sdkwork-specs/SOUL.md`
- `../sdkwork-specs/AGENTS_SPEC.md`
- `../sdkwork-specs/DOCUMENTATION_SPEC.md`
- `../sdkwork-specs/SDK_SPEC.md`
- `../sdkwork-specs/SDK_MANIFEST_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`

Repository-local standards:

- [specs/README.md](specs/README.md)
- [specs/HUB_SPEC.md](specs/HUB_SPEC.md)
- [specs/LINK_SPEC.md](specs/LINK_SPEC.md)
- [specs/CATALOG_SPEC.md](specs/CATALOG_SPEC.md)
- [specs/CONTEXT_SPEC.md](specs/CONTEXT_SPEC.md)
- [specs/VERIFICATION_SPEC.md](specs/VERIFICATION_SPEC.md)
- [specs/GOVERNANCE_SPEC.md](specs/GOVERNANCE_SPEC.md)

Documentation Canon: [docs/README.md](docs/README.md), [docs/product/prd/PRD.md](docs/product/prd/PRD.md), [docs/architecture/tech/TECH_ARCHITECTURE.md](docs/architecture/tech/TECH_ARCHITECTURE.md).

## Status

Initialization (P0): repository baseline, standards, schemas, verification harness. Link materialization, catalog compilation, context generation, and the MCP server are delivered in P1-P3 as defined by [specs/HUB_SPEC.md](specs/HUB_SPEC.md) section 8.
