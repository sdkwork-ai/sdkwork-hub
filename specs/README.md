# Hub Standards

Repository-local normative standards for `sdkwork-hub`. Global platform standards remain in `../sdkwork-specs/` and are cited by relative path; they are never copied here.

## Index

| Spec | Owns |
| --- | --- |
| [HUB_SPEC.md](HUB_SPEC.md) | Purpose, boundaries, authority model, repository dictionary, operating modes, roadmap |
| [LINK_SPEC.md](LINK_SPEC.md) | Gitlink granularity, two-stage source model, pins, sparse checkout, lock file |
| [CATALOG_SPEC.md](CATALOG_SPEC.md) | Derived catalog entities, schemas, determinism, maturity levels, freshness |
| [CONTEXT_SPEC.md](CONTEXT_SPEC.md) | Agent context layers, skills, references, recipes, blueprints, MCP contract |
| [VERIFICATION_SPEC.md](VERIFICATION_SPEC.md) | Verification gates, commands, report format, CI mapping |
| [GOVERNANCE_SPEC.md](GOVERNANCE_SPEC.md) | Ownership, change classes, review, ADR process, promotion, documentation Canon |

## Authority Map

| Fact | Authority |
| --- | --- |
| Global platform rules | `../sdkwork-specs/*_SPEC.md` |
| SDK family identity, ownership, packages | Owner repository `sdks/<family>/sdk-manifest.json` |
| SDK family contract and dependencies | Owner repository `sdks/<family>/specs/component.spec.json` |
| API operations | Owner repository OpenAPI authority document, referenced from `catalog/apis/` |
| Gitlink pins | `sdks/lock.json` |
| Derived SDK/API index | `catalog/` |
| Agent-facing operating procedures | `context/skills/`, `context/recipes/`, `context/blueprints/` |

## Document Grammar

Every hub spec follows this shape:

- Header lines: `Version`, `Status`, `Scope`, `Related`.
- Numbered sections of `Rules:` in normative language (`MUST`, `MUST NOT`, `SHOULD`, `MAY`).
- A `Verification` section naming the exact command that proves the rules.
- No restatement of `sdkwork-specs` bodies. Cite the global spec and section.

## Changing A Standard

1. Read [GOVERNANCE_SPEC.md](GOVERNANCE_SPEC.md) section 4 and classify the change.
2. Record a boundary change as an ADR under `docs/architecture/decisions/`.
3. Update the owning spec, schemas, compiler, and generated artifacts in the same change.
4. Run `node tools/hub.mjs verify`.
