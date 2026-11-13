# Context Pack

Agent-facing context published by the hub. Skills, recipes, and blueprints are authored; references and `index.json` are generated.

## Layers

| Layer | Content | Budget |
| --- | --- | --- |
| L0 | `skills/sdkwork-hub` plus `catalog/index.json` | 400 tokens |
| L1 | One SDK or API card | 800 tokens |
| L2 | Reference section, recipe, blueprint, operation subset | 4,000 tokens |
| L3 | Linked source and full authority document | Unbounded |

## Directories

- `skills/`: the ten required procedures. Start at `skills/sdkwork-hub/SKILL.md`.
- `references/sdks/`: generated per-SDK deep references (P2).
- `overrides/`: authored additions merged into generated references.
- `recipes/`: language golden paths (TypeScript first).
- `blueprints/`: app-type assembly guides.
- `index.json`: generated routing index.

## Rules

- Skills carry procedure, never per-SDK facts.
- Recipes cite global specs and include a verification command.
- Blueprints compose existing platform standards; they do not introduce architecture.
- Read [../specs/CONTEXT_SPEC.md](../specs/CONTEXT_SPEC.md) before adding or changing content.
