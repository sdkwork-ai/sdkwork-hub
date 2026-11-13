# SDKWork Hub PRD

Status: active
Owner: SDKWork platform
Application: none (standards and tooling repository)
Updated: 2026-11-13
Specs: REQUIREMENTS_SPEC.md, DOCUMENTATION_SPEC.md

## 1. Background And Problem

The SDKWork workspace contains 161 SDK families across 71-82 independent repositories. Each family owns a manifest, an authority API contract, up to twelve language packages, and its own release state. No single place answers, quickly and reliably: which SDK provides a capability, which package to install, how to bootstrap it, which operations exist, and which rules apply.

Agents attempting application work must scan dozens of repositories, read generated code to infer operations, and guess at auth and error behavior. The result is slow, non-reproducible, and easy to get wrong.

## 2. Target Users

- Application developers integrating SDKWork SDKs.
- AI agents performing SDK discovery, integration, review, and upgrades.
- SDK owners who need a correct external view of their families.
- Platform maintainers who need drift detection between SDK sources and published guidance.

## 3. Goals And Non-Goals

Goals:

- One entry point for SDK and API discovery across independent repositories.
- Derived, verifiable context for agents: card, reference, recipe, blueprint, MCP.
- Pinned, reproducible view of SDK sources without vendoring them.
- Drift detection between sources, catalog, and context.

Non-goals:

- Generating, building, publishing, or hosting SDKs.
- Replacing `sdk-manifest.json` as the SDK facts authority.
- Becoming an application workspace or monorepo build root.

## 4. Scope

In scope: gitlinks and pins, catalog compilation, agent skills, references, recipes, blueprints, MCP server, release train, verification.

Out of scope: SDK generation internals, registry publishing, runtime API hosting, application-specific business logic.

## 5. User Scenarios

1. An agent adds IAM login to a React app: select the SDK, read the card, apply the TypeScript auth recipe and PC blueprint, run the consumer-import check.
2. An agent adds avatar upload: select Drive, apply the upload recipe, store a media resource reference.
3. A maintainer advances the release train: re-pin, recompile, review the impact report.
4. A reviewer verifies that generated context still matches the pinned sources.

## 6. Success Metrics

- Six golden tasks complete without browsing linked source.
- Catalog compilation is byte-identical across two clean runs.
- Every L2 or L3 family has a reference and at least one consumable recipe.
- MCP answers stay within response caps and never escape the read allowlist.
- Zero hand-edited catalog files in review history.

## 7. Phases

| Phase | Outcome |
| --- | --- |
| P0 | Baseline, standards, schemas, verification |
| P1 | Links, lock, catalog compiler, full SDK/API index |
| P2 | References, TypeScript recipes, skills, blueprints, one example |
| P3 | MCP server with contract tests |
| P4 | Release train, nightly drift, upgrade reports |
| P5 | Stage-2 splits, coverage expansion |

## 8. Linked Requirements

Requirements live under `../requirements/`. Each requirement names the acceptance proof.

## 9. Open Questions

- Stage-2 split breadth: published TypeScript families first, or all 161 families in one program?
- Whether the MCP server ships as a public npm package or a pinned internal artifact.
- Whether the skill pack is distributed by MCP resources only or also as a standalone package.
