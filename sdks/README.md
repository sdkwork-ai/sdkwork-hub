# SDK Links

This directory is the only place where SDK source enters the hub. It contains gitlinks and the pin lock; it contains no authored SDK source.

## Model

| Stage | Path | Points to |
| --- | --- | --- |
| 1 | `modules/<module>` | An SDK-owning module repository |
| 2 | `<sdk-family>` | An independent SDK repository after a governed split |

A gitlink mounts a repository root. The SDK family is reachable at `<gitlink>/sdks/<sdk-family>` in stage 1. The catalog records that relative path.

## Lock

`lock.json` is the only pin authority. Every entry records the canonical URL, the local path, a full 40-character commit SHA, and the SDK families present at that commit.

## Commands

```bash
node tools/hub.mjs link list
node tools/hub.mjs link add sdkwork-iam
node tools/hub.mjs link update sdkwork-iam
node tools/hub.mjs link status
```

## Rules

- Never commit SDK source, generated SDK output, junctions, or symlinks here.
- Never pin a branch or tag; resolve to a commit.
- After a pin change, recompile and commit `catalog/` in the same change.
- Read [../specs/LINK_SPEC.md](../specs/LINK_SPEC.md) before changing this directory.
