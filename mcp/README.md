# @sdkwork/hub-mcp

Read-only MCP server over the committed hub catalog. It answers SDK and API questions for agents and never writes to the repository or the filesystem.

Implementation lands in P3. This directory currently holds the package identity, the component contract, and the tool contract.

## Transport

- `stdio` by default.
- Optional streamable HTTP for hosted use.

## Tools

| Tool | Input | Output |
| --- | --- | --- |
| `sdk_search` | query, surface, language, maturity | Ranked SDK cards |
| `api_search` | query, surface, owner | Ranked API authorities |
| `sdk_get` | family | Full SDK project card |
| `api_operations` | authority, tag, cursor | Operation rows |
| `operation_get` | authority, operationId | Operation detail |
| `integration_plan` | goal, appType, languages, manifest | Ordered integration plan |
| `recipe_get` | language, topic | Recipe body |
| `usage_check` | manifest or import snippet | Violations with spec citations |
| `train_get` | version or current | Release train and compatibility matrix |
| `doc_read` | allowlisted hub path | Document body |

## Resources

`sdkwork://catalog`, `sdkwork://sdk/{family}`, `sdkwork://api/{authority}`, `sdkwork://recipe/{language}/{topic}`, `sdkwork://blueprint/{appType}`, `sdkwork://train/current`.

## Error Codes

`not_found`, `ambiguous`, `stale_catalog`, `unsupported_language`, `low_maturity`, `invalid_input`.

## Safety

- Read-only: no tool mutates the repository, filesystem, or network state.
- `doc_read` resolves only inside `specs/`, `context/`, and `docs/`; traversal and absolute paths are rejected.
- Responses are capped at 64 KiB or return a cursor.
- No credentials, tokens, or machine-local paths are returned.
- Every response carries `catalogVersion` and `compiledAt`; stale catalogs are marked `stale_catalog`.

## Standards

- [../specs/CONTEXT_SPEC.md](../specs/CONTEXT_SPEC.md) section 6
- [../specs/VERIFICATION_SPEC.md](../specs/VERIFICATION_SPEC.md) section 3.7
- [../specs/GOVERNANCE_SPEC.md](../specs/GOVERNANCE_SPEC.md) section 8
