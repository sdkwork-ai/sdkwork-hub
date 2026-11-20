# SDKWork Hub Catalog Standard

- Version: 1.0
- Status: active
- Scope: catalog entities, layout, derivation rules, determinism, maturity levels, freshness, prohibited patterns
- Related: `HUB_SPEC.md`, `LINK_SPEC.md`, `CONTEXT_SPEC.md`, `VERIFICATION_SPEC.md`, `../sdkwork-specs/SDK_SPEC.md`, `../sdkwork-specs/SDK_MANIFEST_SPEC.md`, `../sdkwork-specs/SDK_PACKAGE_NAMING_SPEC.md`, `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`, `../sdkwork-specs/API_SPEC.md`

This standard defines the derived catalog that agents query. The catalog is a projection, not an authority.

## 1. Entities

| Entity | Identity | Source |
| --- | --- | --- |
| Module | git repository name | `sdks/lock.json` and the linked checkout |
| SDK project | `sdkFamily` directory name | `<module>/sdks/<sdkFamily>/sdk-manifest.json` |
| API authority | authority name such as `sdkwork-iam-app-api` | SDK family `openapi/` or `rpc/` inputs |
| Operation | `operationId` within an authority | OpenAPI authority document |
| Package | language package path | SDK family `languages[]` and language package manifests |

Rules:

- Every catalog entity `MUST` trace to a source file inside a pinned checkout.
- A catalog entity `MUST NOT` exist without a pinned source. Manually seeded entries are forbidden.
- One SDK family `MUST` map to at most one API authority. One API authority `MUST` map to exactly one owning SDK family.
- A family without an authority document `MUST` still appear as an SDK project with `apiAuthority: null` and `operations.count: 0`.

## 2. Layout

```text
catalog/
  index.json                    # counts, digests, compiledAt, freshness
  sdks/<sdkFamily>.json         # one SDK project per family
  apis/<apiAuthority>.json      # authority metadata + operation inventory
  operations/<apiAuthority>.json# operation detail rows
  modules/<module>.json         # repository card
```

Rules:

- File names `MUST` equal the entity identity exactly, with characters outside `[a-z0-9._-]` rejected.
- Every catalog file `MUST` validate against its schema in `schemas/`.
- `catalog/index.json` `MUST` list every emitted file and its SHA-256.

## 3. SDK Project Fields

Required: `schemaVersion`, `kind`, `generated`, `generator`, `family`, `stem`, `domain`, `surface`, `sdkKind`, `owner`, `source`, `apiAuthority`, `apiPrefix`, `languages`, `packages`, `operations`, `dependencies`, `maturity`, `provenance`.

- `surface` `MUST` be one of `open`, `app`, `backend`, `internal`, `rpc`, `none`.
- `sdkKind` `MUST` be one of `http-openapi`, `rpc`, `provider-runtime`, `language-native`.
- `source` `MUST` contain `stage`, `path`, `commit`, and `manifestPath`.
- `packages[]` `MUST` distinguish consumer and transport names for TypeScript per `SDK_PACKAGE_NAMING_SPEC.md`.
- `dependencies` `MUST` mirror the family manifest `sdkDependencies`; the catalog `MUST NOT` add dependencies the manifest does not declare.
- `operations` `MUST` contain `count`, `tags`, and `path` to the operation detail file.

## 4. API Authority Fields

Required: `schemaVersion`, `kind`, `generated`, `generator`, `authority`, `surface`, `prefix`, `owner`, `sdkFamily`, `specPath`, `specHash`, `protocol`, `operations`.

- `specPath` `MUST` be relative to the linked checkout.
- `specHash` `MUST` be the SHA-256 of the authority document at the pinned commit.
- `operations` `MUST` list every `operationId` with `method`, `path`, `tags`, `authMode`, and `summary`.
- Duplicate `operationId` values inside one authority `MUST` fail compilation.

## 5. Derivation Rules

- Compilation `MUST` read manifests, language package manifests, OpenAPI documents, and component specs only. It `MUST NOT` read generated source files to infer contracts.
- Compilation `MUST` be reproducible: the same pins, schemas, and compiler version `MUST` produce byte-identical output.
- Compilation `MUST` fail closed on unreadable JSON, missing required fields, unresolved `sdkDependencies`, or an authority document that does not parse as OpenAPI 3.x or the declared RPC protocol.
- Compilation `MUST` warn, not invent, when a family declares a language package whose manifest is absent.
- Generated output `MUST` use LF newlines, two-space indentation, and sorted object keys.
- `compiledAt` and `pinsDigest` `MUST` appear only in `catalog/index.json`.

## 6. Maturity Levels

| Level | Name | Requirement |
| --- | --- | --- |
| L0 | Discovered | Family directory exists at the pinned commit |
| L1 | Structured | `sdk-manifest.json` parses and required identity fields are present |
| L2 | Consumable | L1 plus resolvable language packages and, for HTTP/RPC families, a parsed authority with operations |
| L3 | Released | L2 plus a release train entry and a published or documented release channel for at least one language |

Rules:

- A family `MUST` be assigned exactly one level.
- `context/` `MUST NOT` publish recipes or usage guarantees for a family below L2.
- L3 claims `MUST` cite release evidence. A manifest `releaseState` value alone is not evidence.

## 7. Freshness

Rules:

- `catalog/index.json` `MUST` carry `compiledAt` (ISO-8601 UTC) and `pinsDigest`.
- A catalog older than 7 days relative to `sdks/lock.json` `MUST` be reported as `stale` by the MCP server and `hub info`.
- CI `MUST` recompile and byte-compare. A diff `MUST` fail the gate.
- Nightly refresh `MUST` open a change when upstream pins or metadata change.

## 8. Prohibited Patterns

- Hand-editing `catalog/`.
- Introducing a parallel SDK registry that restates ownership, dependencies, or generation inputs as an authority.
- Copying OpenAPI documents, generated SDK source, or package build output into the catalog.
- Inferring operation inventory from generated client code.
- Publishing a maturity level that the evidence does not support.

## 9. Verification

```bash
node tools/hub.mjs catalog check
node tools/hub.mjs verify
```
