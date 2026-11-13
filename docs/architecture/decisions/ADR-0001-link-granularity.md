# ADR-0001: Link Granularity

Status: Accepted
Date: 2026-11-13
Affects: `specs/LINK_SPEC.md`, `specs/HUB_SPEC.md`

## Context

The hub must integrate SDK families that currently live inside 71-82 independent module repositories. A gitlink mounts a repository root; it cannot mount a repository subdirectory. Two candidate models exist: link module repositories and present SDK families as logical projects, or split every SDK family into its own repository.

## Decision

Link module repositories at `sdks/modules/<module>` and treat each SDK family as an independent logical SDK project in the catalog.

## Consequences

- No repository split is required to start; the catalog and context are available immediately.
- The catalog must carry the source path inside the linked repository.
- Agents resolve source paths from the catalog, never from a hard-coded directory pattern.
- Stage-2 repository splits remain possible without changing the `sdks/` namespace.

## Alternatives

- Split all 161 families into standalone repositories. Rejected for P0-P3: it rewrites generation ownership, release pipelines, and 71 module build graphs before any context value is delivered.
- Lock file plus on-demand sparse clones with no gitlinks. Rejected: it weakens provenance and contradicts the requirement to integrate by git link.
