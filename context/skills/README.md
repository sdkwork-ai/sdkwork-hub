# Skills

Each skill is a procedure, decision tree, or checklist for one class of SDKWork work. Skills cite standards and the catalog; they never embed per-SDK facts.

## Shape

```text
skills/<skill-name>/
  SKILL.md
```

## Rules

- Directory name is lowercase kebab-case and equals the frontmatter `name`.
- Frontmatter requires `name` and `description`; the description states the trigger and outcome.
- A skill names its inputs, the files or tools it may touch, the governing specs, and the verification command.
- Required skills are listed in [../../specs/CONTEXT_SPEC.md](../../specs/CONTEXT_SPEC.md) section 2.

Start at [sdkwork-hub/SKILL.md](sdkwork-hub/SKILL.md).
