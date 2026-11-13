# SDKWork Hub Verification Standard

- Version: 1.0
- Status: active
- Scope: verification gates, commands, failure codes, report format, CI mapping, exemptions
- Related: `HUB_SPEC.md`, `LINK_SPEC.md`, `CATALOG_SPEC.md`, `CONTEXT_SPEC.md`, `GOVERNANCE_SPEC.md`, `../sdkwork-specs/TEST_SPEC.md`, `../sdkwork-specs/QUALITY_GATE_SPEC.md`, `../sdkwork-specs/REPOSITORY_BASELINE_SPEC.md`

This standard defines how the hub proves its own correctness.

## 1. Gate Model

Every gate has a stable failure code, a command, and a pass criterion.

| Gate | Code prefix | Proves |
| --- | --- | --- |
| Baseline | `BASE` | Repository L1 files, Canon documents, shims, `.sdkwork/` |
| Standards | `SPEC` | Six hub specs present and linked from `specs/README.md` |
| Schema | `SCH` | Every catalog/context artifact validates against `schemas/` |
| Link | `LINK` | Gitlinks, pins, lock ordering, checkout freshness |
| Catalog | `CAT` | Deterministic compilation, no hand edits, freshness |
| Context | `CTX` | Skills, references, recipes, blueprints, budgets |
| MCP | `MCP` | Tool and resource contract, read-only behavior, path safety |
| Hygiene | `HYG` | No secrets, no machine-local absolute paths, no generated source |

## 2. Commands

```bash
node tools/hub.mjs verify            # all gates that do not require network or sources
node tools/hub.mjs verify --linked   # adds LINK checkout checks
node tools/hub.mjs link list
node tools/hub.mjs info
node --test
```

Rules:

- `verify` `MUST` run offline and `MUST NOT` mutate the repository.
- `verify --linked` `MUST` be the only mode that may inspect linked worktrees.
- `verify` `MUST` exit non-zero on the first failing gate after reporting every violation it can collect.
- A gate `MUST` print `code: path: message` one violation per line, followed by a summary.

## 3. Gate Requirements

### 3.1 BASE

- Required: `AGENTS.md`, `README.md`, `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, `LICENSE`, `.gitignore`, `.sdkwork/README.md`, `.sdkwork/skills/README.md`, `.sdkwork/plugins/README.md`, `.sdkwork/.gitignore`.
- Required Canon: `docs/README.md`, `docs/INDEX.yaml`, `docs/product/prd/PRD.md`, `docs/architecture/tech/TECH_ARCHITECTURE.md`.
- `README.md` `MUST` declare `repository-kind:`.

### 3.2 SPEC

- Required: the six files named in `specs/README.md`.
- Each spec `MUST` carry a version, scope, and a `Verification` section.
- `specs/README.md` `MUST` link every spec.

### 3.3 SCH

- Every file under `catalog/` `MUST` parse as JSON and declare `schemaVersion`.
- Every authored JSON artifact under `context/` `MUST` parse as JSON and declare `schemaVersion`.
- Each artifact kind `MUST` have a schema under `schemas/` whose `$id` matches its `kind`.
- Unknown schema kinds `MUST` fail.

### 3.4 LINK

- `sdks/lock.json` `MUST` parse and satisfy `schemas/hub.lock.v1.json`.
- `repos` `MUST` be sorted by `module` with unique `module` and `path`.
- `commit` `MUST` be a full SHA.
- Every `.gitmodules` path `MUST` be under `sdks/` and have a lock entry, and every lock entry `MUST` have a gitlink.
- In `--linked` mode, each initialized checkout `HEAD` `MUST` equal its pin.

### 3.5 CAT

- `catalog/index.json` `MUST` list every entity file with a matching SHA-256.
- Counts in `index.json` `MUST` equal emitted files.
- `compiledAt` older than 7 days `MUST` report `stale` (warning offline, failure in release mode).
- A generated file missing `"generated": true` `MUST` fail.

### 3.6 CTX

- Required skills `MUST` exist, with `name` and `description` frontmatter, `name` equal to the directory.
- `context/index.json` `MUST` list every skill, reference, recipe, and blueprint emitted.
- References `MUST` stay under 6,000 tokens (measured by the compiler).
- Every recipe `MUST` contain a `Verification` section or verification command.
- A reference or recipe for a family below L2 `MUST` fail.

### 3.7 MCP

- Declared tools `MUST` equal the ten tools in `CONTEXT_SPEC.md` section 6; resources `MUST` equal the six declared.
- Tool schemas `MUST` reject unknown top-level properties.
- Tests `MUST` prove `doc_read` rejects traversal, absolute paths, and paths outside the allowlist.
- Tests `MUST` prove no tool writes to the filesystem.

### 3.8 HYG

- No tracked file `MUST` contain a private key, access token, API key, or credential URL.
- No tracked file `MUST` contain a machine-local absolute path such as a user-home directory or a drive-rooted worktree path.
- No generated SDK source `MUST` exist under `catalog/`, `context/`, or `sdks/`.
- Exemptions require an allowlist entry with a reason in `tools/verify/allowlist.json`.

## 4. Report Format

```text
verify: 8 gates, 6 passed, 2 failed
BASE: pass
SCH: fail
  SCH: catalog/index.json: root: missing required property "counts"
...
```

Rules:

- Output `MUST` be stable and diff-friendly.
- A passing run `MUST` print a single summary line plus per-gate status.

## 5. CI Mapping

| Workflow | Gates |
| --- | --- |
| `.github/workflows/verify.yml` | BASE, SPEC, SCH, LINK (offline), CAT, CTX, HYG |
| `.github/workflows/linked.yml` | LINK with materialized sources, nightly |
| `.github/workflows/mcp.yml` | MCP contract tests |
| Nightly refresh | CAT recompilation and drift report |

Rules:

- A pull request `MUST` pass `verify` and `node --test` before review.
- A catalog or context regeneration change `MUST` include the compiler run output in the pull request description.

## 6. Exemptions

- An exemption `MUST` be scoped, justified, owned, and dated in `tools/verify/allowlist.json`.
- An exemption `MUST` expire. Permanent exemptions are forbidden.
- A security or secret-hygiene violation `MUST NOT` be exempted.

## 7. Verification

```bash
node tools/hub.mjs verify
```
