# Developer Guide

## Add Or Change A Hub Command

1. Read `../../specs/VERIFICATION_SPEC.md` and the owning spec.
2. Implement under `tools/commands/` or `tools/lib/` with no runtime dependency.
3. Add a gate or test when the command proves a rule.
4. Run `node tools/hub.mjs verify` and `node --test`.

## Add Or Change A Generated Artifact

1. Update the schema in `schemas/`.
2. Update the compiler and the owning spec.
3. Regenerate and commit the artifact in the same change.
4. Prove determinism by running the compiler twice.

## Change A Standard

1. Classify the change with `../../specs/GOVERNANCE_SPEC.md` section 2.
2. Record a boundary change as an ADR under `../architecture/decisions/`.
3. Update the spec and `specs/README.md` links.
4. Run the verification matrix.
