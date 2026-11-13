# SDKWork Hub Context Standard

- Version: 1.0
- Status: active
- Scope: agent context layers and budgets, skills, references, recipes, blueprints, MCP contract, task routing
- Related: `HUB_SPEC.md`, `CATALOG_SPEC.md`, `VERIFICATION_SPEC.md`, `GOVERNANCE_SPEC.md`, `../sdkwork-specs/AGENTS_SPEC.md`, `../sdkwork-specs/APP_SDK_INTEGRATION_SPEC.md`, `../sdkwork-specs/SDK_SPEC.md`, `../sdkwork-specs/IAM_LOGIN_INTEGRATION_SPEC.md`, `../sdkwork-specs/API_SPEC.md`, `../sdkwork-specs/PAGINATION_SPEC.md`, `../sdkwork-specs/DRIVE_SPEC.md`

This standard defines the agent-facing context the hub publishes and the contract that keeps it small, accurate, and progressively loadable.

## 1. Context Layers

| Layer | Content | Budget | Loaded when |
| --- | --- | --- | --- |
| L0 | Hub skill router and catalog summary | 400 tokens | Session start for hub work |
| L1 | One SDK or API card | 800 tokens | Selecting a candidate |
| L2 | Task bundle: reference sections, recipe, blueprint, operation subset | 4,000 tokens | Integration confirmed |
| L3 | Linked source and full authority document | Unbounded | Debugging or deep customization |

Rules:

- Context `MUST` be loadable in this order without reading another layer first, except that L2 assumes one L1 card.
- A layer `MUST` link to the next layer instead of embedding it.
- The hub `MUST NOT` require an agent to read `sdks/` or the workspace to answer an L0-L2 question.

## 2. Skills

Skills live in `context/skills/<skill-name>/SKILL.md`.

Required skills:

| Skill | Trigger |
| --- | --- |
| `sdkwork-hub` | Using the hub, catalog, or MCP for any SDK decision |
| `sdk-selection` | Choosing SDKs, surfaces, and languages for a goal |
| `sdk-integration-web` | React, Vue, H5, or mini-program consumption |
| `sdk-integration-flutter` | Flutter and Dart consumption |
| `sdk-integration-native` | Android, iOS, Harmony, and desktop native consumption |
| `sdk-integration-backend` | Rust, Java, Go, or Node service consumption |
| `sdk-auth-session` | Tokens, sessions, IAM bootstrap, credential entry |
| `sdk-errors-pagination` | Envelope, problem details, pagination, idempotency, retry |
| `sdk-media-drive` | Drive upload, download, and media resources |
| `sdk-version-upgrade` | Release train upgrades and breaking changes |

Rules:

- `SKILL.md` `MUST` begin with YAML frontmatter containing `name` and `description`.
- `name` `MUST` equal the directory name and be lowercase kebab-case.
- `description` `MUST` state the trigger and the outcome in one or two sentences.
- A skill `MUST` describe a procedure, decision tree, or checklist. It `MUST NOT` embed operation inventories, package tables, or per-SDK facts; those belong to references and the catalog.
- A skill `MUST` cite the governing global spec by relative path instead of restating it.
- A skill `MUST` name the verification command that proves its result.

## 3. References

References live in `context/references/sdks/<sdkFamily>.md` and are generated.

Required sections:

1. Identity and maturity
2. When to use and when not to use
3. Surfaces, prefixes, and auth modes
4. Packages by language
5. Bootstrap and credentials
6. Operation map
7. Envelopes, errors, pagination
8. Dependencies and composition
9. Anti-patterns
10. Verification
11. Source pointers
12. Notes merged from `context/overrides/<sdkFamily>.md`

Rules:

- References `MUST` be generated from `catalog/` plus the pinned source metadata.
- `context/overrides/<sdkFamily>.md` is authored and `MUST` be merged into section 12 by the compiler. It `MUST NOT` contradict catalog facts.
- A reference `MUST` stay under 6,000 tokens; overflow moves detail to the operation inventory or the source pointer.
- References `MUST` be generated only for L2 and L3 families.

## 4. Recipes

Recipes live in `context/recipes/<language>/<topic>.md`.

| Topic | Required content |
| --- | --- |
| `install` | Package name, version source, workspace and registry instructions |
| `init` | Client construction, base URL, transport, token provider |
| `auth` | Required headers, TokenManager wiring, credential modes |
| `errors` | Envelope unwrap, problem details, retryable classes |
| `pagination` | Cursor and page models, termination, idempotency |
| `upload` | Drive SDK flow, media resource, progress and resume |
| `testing` | Contract test setup and verification commands |

Rules:

- Language priority `MUST` follow published coverage: TypeScript first, then Rust, Java, Python, Flutter, Go, then the remaining languages.
- A recipe `MUST` cite the owning global spec and `MUST NOT` redefine API semantics.
- A recipe `MUST` include at least one runnable snippet and one verification command.
- A recipe `MUST NOT` claim support for a language or family below maturity L2.

## 5. Blueprints

Blueprints live in `context/blueprints/<app-type>.md`.

Required set: `pc-react`, `h5`, `mobile-react`, `flutter`, `mini-program`, `android-native`, `ios-native`, `harmony-native`, `desktop-tauri`, `backend-service`.

Each blueprint `MUST` define, in order:

1. Technology selection and owned specs
2. Layering: shell, composition, service-SDK, UI
3. SDK assembly order and surfaces
4. Bootstrap: base URL, TokenManager, IAM wiring
5. Errors, pagination, and i18n
6. Upload and media
7. Testing and verification
8. Anti-patterns

Rules:

- A blueprint `MUST` compose existing platform standards and `MUST NOT` introduce a new architecture.
- A blueprint `MUST` link the exact recipes and SDK references it requires.

## 6. MCP Contract

The MCP server package is `@sdkwork/hub-mcp` and is read-only.

Tools:

| Tool | Input | Output |
| --- | --- | --- |
| `sdk_search` | query, surface, language, maturity | Ranked SDK cards |
| `api_search` | query, surface, owner | Ranked API authorities |
| `sdk_get` | family | Full SDK project card |
| `api_operations` | authority, tag, cursor | Operation rows |
| `operation_get` | authority, operationId | Operation detail |
| `integration_plan` | goal, appType, languages, existing manifest | Ordered plan with packages, auth, snippets, verification |
| `recipe_get` | language, topic | Recipe body |
| `usage_check` | manifest or import snippet | Violations with spec citations |
| `train_get` | none or version | Current release train and matrix |
| `doc_read` | allowlisted hub path | Document body |

Resources: `sdkwork://catalog`, `sdkwork://sdk/{family}`, `sdkwork://api/{authority}`, `sdkwork://recipe/{language}/{topic}`, `sdkwork://blueprint/{appType}`, `sdkwork://train/current`.

Rules:

- Every tool `MUST` be read-only and `MUST NOT` write to the repository or filesystem.
- `doc_read` `MUST` resolve only inside `specs/`, `context/`, and `docs/`. Path traversal and absolute paths `MUST` be rejected.
- Responses `MUST` include `catalogVersion` and `compiledAt`, and `MUST` set a `stale_catalog` warning when freshness fails.
- A response `MUST` be capped at 64 KiB or return a cursor. List pages `MUST` default to at most 30 rows.
- Error codes `MUST` be one of `not_found`, `ambiguous`, `stale_catalog`, `unsupported_language`, `low_maturity`, `invalid_input`.
- Tool names, schemas, and error codes `MUST` be versioned with the package major version.

## 7. Task Routing

| Task | Context bundle | Completion proof |
| --- | --- | --- |
| Add login to a web app | `sdk-selection`, IAM app SDK card, `recipes/typescript/auth`, `blueprints/pc-react` | `check-app-sdk-consumer-imports` |
| Upload media | Drive app SDK card, `recipes/typescript/upload`, media rules | Upload declaration check |
| List with pagination | SDK card, `recipes/<language>/pagination` | Contract test |
| Consume backend API | Backend SDK card, `blueprints/backend-service` | Surface boundary check |
| Upgrade release train | `train_get`, diff, `sdk-version-upgrade` | Impact report plus changelog |
| Flutter integration | Flutter SDK card, `recipes/flutter/init`, `blueprints/flutter` | Build and analyze pass |

Rules:

- A routing row `MUST` name a completion proof. If no proof exists, the context is incomplete.

## 8. Verification

```bash
node tools/hub.mjs context build --check
node tools/hub.mjs verify
node --test
```

The gate `MUST` fail on missing required skills, missing frontmatter, a reference above budget, a recipe without a verification command, an MCP tool outside the declared set, or an L2 claim without catalog evidence.
