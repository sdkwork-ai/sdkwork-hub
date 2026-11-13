# ADR-0002: Two-Stage Source Model

Status: Accepted
Date: 2026-11-13
Affects: `specs/LINK_SPEC.md`

## Context

Some SDK families will eventually deserve independent repositories. A migration that changes the hub namespace and agent-facing paths at the same time would break consumers twice.

## Decision

Use two source stages under the same namespace:

- Stage 1: `sdks/modules/<module>` points to the SDK-owning module repository.
- Stage 2: `sdks/<sdk-family>` points to an independent SDK repository.

The catalog declares the stage and the concrete path. Context resolves paths through the catalog.

## Consequences

- Stage 1 is the default and is not described as a temporary hack; it is the correct model while the owner repository owns generation.
- A split requires the family to move end to end: authority, manifest, component spec, generation scripts, release channel.
- The original module repository must consume the released package and remove the local family in the same coordinated change.
- Train entries pin both repositories during the transition window.

## Alternatives

- Big-bang split. Rejected: high risk, no incremental value.
- Stage-1-only model. Rejected: forfeits the option of one-repository-per-SDK for provider or high-traffic families.
