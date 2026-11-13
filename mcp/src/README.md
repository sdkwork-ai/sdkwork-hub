# MCP Server Source

Implementation is delivered in P3 per [../specs/CONTEXT_SPEC.md](../specs/CONTEXT_SPEC.md) section 6:

- `catalog/` reader over committed artifacts
- `tools/` one module per declared tool
- `resources/` one resolver per declared resource
- `prompts/` optional `integrate-sdk` and `review-sdk-integration`

The package must remain read-only and dependency-audited before release.
