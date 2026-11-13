# Repository Plugins

Repository-local agent extensions for hub maintenance, when a skill alone is insufficient.

## Rules

- A plugin directory is lowercase kebab-case.
- The plugin manifest identifies name, version, owner, description, and contributed skills or tools.
- Plugin skills follow the same rules as `.sdkwork/skills/`.
- Plugins must not vendor external toolchains, generated SDK output, secrets, caches, or logs.
- A plugin that wraps a hub command must call the canonical command.
