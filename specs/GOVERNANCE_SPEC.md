# SDKWork Hub Governance Standard

- Version: 1.0
- Status: active
- Scope: ownership roles, change classes, review, ADR process, promotion to global standards, documentation Canon, security, release train governance
- Related: `HUB_SPEC.md`, `LINK_SPEC.md`, `CATALOG_SPEC.md`, `CONTEXT_SPEC.md`, `VERIFICATION_SPEC.md`, `../sdkwork-specs/ARCHITECTURE_DECISION_SPEC.md`, `../sdkwork-specs/GOVERNANCE_SPEC.md`, `../sdkwork-specs/DOCUMENTATION_SPEC.md`, `../sdkwork-specs/CODE_REVIEW_SPEC.md`

This standard defines who may change what, how decisions are recorded, and how a hub rule becomes a platform rule.

## 1. Roles

| Role | Owns |
| --- | --- |
| Hub maintainer | `specs/`, `schemas/`, `tools/`, repository baseline, CI |
| Catalog owner | Catalog compiler, maturity assignment, freshness |
| Context owner | `context/skills/`, `context/recipes/`, `context/blueprints/`, `context/overrides/` |
| MCP owner | `mcp/` server and its contract tests |
| Documentation owner | `docs/` Canon and guides |
| SDK owner | The linked SDK family and its metadata in the owner repository |

Rules:

- Every change `MUST` have exactly one accountable role.
- A role `MUST NOT` approve its own boundary change.

## 2. Change Classes

| Class | Examples | Requirements |
| --- | --- | --- |
| Editorial | Typo, link, wording that does not change a rule | One review, `verify` green |
| Context | Skill, recipe, blueprint, override | Context owner review, `verify` green |
| Catalog | Compiler logic, schema, maturity rule | Catalog owner review, regenerated artifacts, schema tests |
| Link | Pin advance, stage-2 split, repository add/remove | Hub maintainer plus affected SDK owner, ADR |
| Standard | Rule, boundary, directory, phase change | Hub maintainer review, ADR, `verify` green |
| Security | Secret handling, MCP read boundary | Hub maintainer and security reviewer, no exemption |

Rules:

- A change that alters an authority boundary `MUST` be classified as Standard or Link.
- A change that alters generated artifact shape `MUST` include the schema change and the regenerated artifacts.
- A change `MUST NOT` mix classes in one commit when it obscures review.

## 3. Review Rules

- Review `MUST` verify the change against the owning spec, not only against the diff.
- Review `MUST` confirm that `catalog/` and generated `context/` changes were produced by the compiler, not by hand.
- Review `MUST` confirm that no authored rule was copied from `sdkwork-specs`.
- A link or release train change `MUST` state the reason and the affected SDK families.

## 4. Architecture Decisions

Rules:

- A decision that changes a boundary, directory, authority chain, or phase `MUST` be recorded as an ADR under `docs/architecture/decisions/`.
- ADR file names `MUST` be `ADR-<nnnn>-<kebab-title>.md` and `MUST` be linked from `docs/architecture/decisions/README.md`.
- An ADR `MUST` state context, decision, consequences, alternatives, and the spec sections it changes.
- An accepted ADR `MUST` update the owning spec in the same change or name the follow-up task.
- Superseded ADRs `MUST` remain and be marked superseded; they `MUST NOT` be deleted.

## 5. Exceptions

- A pin rollback, a maturity downgrade, or a gate exemption `MUST` be recorded with owner, reason, scope, and expiry.
- A rollback is a defect response of last resort. Recovery `MUST` be additive and explicit, per `../sdkwork-specs/ROLLBACK_RESTRICTION_SPEC.md`.
- Exceptions `MUST` be listed in `docs/releases/` evidence or `tools/verify/allowlist.json` as appropriate.

## 6. Promotion To Global Standards

Rules:

- A hub rule that governs repositories outside the hub `MUST` be promoted to `sdkwork-specs/` rather than enforced from here.
- Promotion `MUST` keep the hub copy as a thin pointer with a version reference; the global spec becomes authoritative.
- Hub-only operational rules (catalog, context budget, MCP contract) `MAY` remain repository-local.
- The promotion `MUST` be recorded in `docs/architecture/decisions/`.

## 7. Documentation Canon

Rules:

- `docs/` `MUST` follow `../sdkwork-specs/DOCUMENTATION_SPEC.md` section 2.
- Root `README.md`, `AGENTS.md`, and this spec `MUST` link `docs/README.md`, `docs/product/prd/PRD.md`, and `docs/architecture/tech/TECH_ARCHITECTURE.md`.
- Canon documents `MUST` describe boundaries and link specs. They `MUST NOT` become a second copy of `specs/`.
- Working documents `MUST` live under `docs/engineering/plans/` and `docs/engineering/reviews/`.

## 8. Security And Privacy

- The hub `MUST NOT` store credentials, tokens, private keys, or credential-bearing URLs.
- The MCP server `MUST` be read-only and `MUST` restrict file reads to `specs/`, `context/`, and `docs/`.
- A linked repository `MUST` be fetched only from its canonical upstream URL.
- Logs and verification reports `MUST NOT` include secret values, even truncated.

## 9. Release Train Governance

- A train `MUST` be a coherent set of pins validated together, with a semantic train version.
- A train advance `MUST` include an impact report: changed SDKs, changed operations, breaking changes, affected blueprints.
- A deprecated SDK `MUST` state its replacement and removal train.
- A train `MUST NOT` pin a branch. Only commits or immutable tags resolved to commits.

## 10. Verification

```bash
node tools/hub.mjs verify
```
