# Recipes

Language golden paths for consuming SDKWork SDKs. Each recipe is scoped to one language and one topic.

## Matrix

| Topic | Purpose |
| --- | --- |
| `install` | Package name, version source, workspace or registry instructions |
| `init` | Client construction, base URL, transport |
| `auth` | Token provider, headers, credential modes |
| `errors` | Envelope, problem details, retryable classes |
| `pagination` | Cursor and page models, termination |
| `upload` | Drive flow, media resource, progress |
| `testing` | Contract tests and verification commands |

## Priority

TypeScript first, then Rust, Java, Python, Flutter, Go, then the remaining languages. Coverage follows catalog maturity; a language is added only when at least one L2 family supports it.

## Rules

- Cite the governing global spec; do not redefine API semantics.
- Include a runnable snippet and a verification command.
- Do not claim support below maturity L2.
- Keep one file under 2,000 tokens.

Read [../specs/CONTEXT_SPEC.md](../specs/CONTEXT_SPEC.md) section 4.
