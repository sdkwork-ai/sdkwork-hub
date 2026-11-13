# Documentation

Human narrative for `sdkwork-hub`. Machine contracts live in `../specs/`, `../schemas/`, and `../catalog/`; this directory routes readers and records decisions and evidence.

## Audience Routing

| Reader | Start here |
| --- | --- |
| Integrator adding an SDK to an application | [guides/integrator/README.md](guides/integrator/README.md) |
| Maintainer changing the hub | [guides/developer/README.md](guides/developer/README.md) |
| Operator refreshing links, catalog, or train | [guides/operator/README.md](guides/operator/README.md) |
| Reviewer judging a change | [engineering/reviews/README.md](engineering/reviews/README.md) |

## Canon

- [Product PRD](product/prd/PRD.md): what the hub is for, who uses it, phases, success metrics.
- [Technical Architecture](architecture/tech/TECH_ARCHITECTURE.md): boundaries, layout, ownership, verification.
- [Architecture Decisions](architecture/decisions/README.md): accepted and superseded decisions.

## Layers

| Layer | Path | Purpose |
| --- | --- | --- |
| Product | `product/` | PRD and requirements |
| Architecture | `architecture/` | Tech architecture, decisions, views |
| Guides | `guides/` | Developer, integrator, operator procedures |
| Engineering | `engineering/` | Plans and reviews |
| Evidence | `runbooks/`, `changelogs/`, `migrations/`, `releases/` | Operations and release history |
| Extension | `domains/` | Domain-specific depth |
| Archive | `archive/` | Retired history, append-only |

## Rules

- Canon documents describe decisions and link specs. They must not duplicate `specs/`.
- Plans and reviews live under `engineering/`.
- Retired material moves to `archive/`; it is never deleted.
