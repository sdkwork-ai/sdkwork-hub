# Operator Guide

## Refresh Links

```bash
node tools/hub.mjs link update <module>
node tools/hub.mjs link status
node tools/hub.mjs catalog check
```

## Verify A Change

```bash
node tools/hub.mjs verify
node tools/hub.mjs verify --linked
```

## Refresh The Train

1. Re-pin the affected modules.
2. Recompile the catalog.
3. Produce the impact report: changed SDKs, changed operations, breaking changes, affected blueprints.
4. Commit the train, catalog, and context together.
5. Record release evidence under `../releases/`.

## Failure Handling

- A pin mismatch fails the LINK gate; fix the checkout or the lock, never suppress the gate.
- A stale catalog warns offline and fails release mode; recompile before release.
- A secret or absolute-path finding is never exempted.
