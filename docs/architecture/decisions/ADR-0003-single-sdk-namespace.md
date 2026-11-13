# ADR-0003: Single SDK Namespace

Status: Accepted
Date: 2026-11-13
Affects: `specs/HUB_SPEC.md`, `specs/LINK_SPEC.md`, `specs/CONTEXT_SPEC.md`

## Context

A draft layout used a top-level `links/` directory for source checkouts and a separate `catalog/` tree for SDK records. Reviewers found `links` ambiguous and expected SDK sources and SDK projects under `sdks/`.

## Decision

`sdks/` is the only SDK namespace. It contains gitlinks, their pins, and no authored SDK source. There is no `links/`, `sources/`, or materialized view layer. `catalog/` contains only derived records, separated from source provenance.

## Consequences

- One obvious place for an agent or human to look for SDK source.
- No junction, symlink, or copied tree is needed to present an SDK.
- Stage-1 family paths are deep (`sdks/modules/<module>/sdks/<family>`); the catalog and MCP hide the depth.
- `catalog/` remains necessary because per-SDK records must be available in thin mode without source.
