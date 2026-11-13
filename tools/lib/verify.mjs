import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ROOT,
  abs,
  exists,
  fileSha256,
  listDirs,
  readJson,
  readText,
  tokenEstimate,
  walk,
} from './util.mjs';
import { validate } from './schema.mjs';

const REQUIRED_BASELINE = [
  'AGENTS.md',
  'README.md',
  'CLAUDE.md',
  'GEMINI.md',
  'CODEX.md',
  'LICENSE',
  '.gitignore',
  '.sdkwork/README.md',
  '.sdkwork/.gitignore',
  '.sdkwork/skills/README.md',
  '.sdkwork/plugins/README.md',
  'docs/README.md',
  'docs/INDEX.yaml',
  'docs/product/README.md',
  'docs/product/prd/README.md',
  'docs/product/prd/PRD.md',
  'docs/architecture/README.md',
  'docs/architecture/tech/README.md',
  'docs/architecture/tech/TECH_ARCHITECTURE.md',
];

const REQUIRED_SPECS = [
  'HUB_SPEC',
  'LINK_SPEC',
  'CATALOG_SPEC',
  'CONTEXT_SPEC',
  'VERIFICATION_SPEC',
  'GOVERNANCE_SPEC',
];

const REQUIRED_SKILLS = [
  'sdkwork-hub',
  'sdk-selection',
  'sdk-integration-web',
  'sdk-integration-flutter',
  'sdk-integration-native',
  'sdk-integration-backend',
  'sdk-auth-session',
  'sdk-errors-pagination',
  'sdk-media-drive',
  'sdk-version-upgrade',
];

const KIND_SCHEMA = {
  'sdkwork.hub.lock': 'hub.lock.v1.json',
  'sdkwork.hub.catalog-index': 'hub.catalog-index.v1.json',
  'sdkwork.hub.sdk-project': 'hub.sdk-project.v1.json',
  'sdkwork.hub.api-authority': 'hub.api-authority.v1.json',
  'sdkwork.hub.operation-index': 'hub.operation-index.v1.json',
  'sdkwork.hub.context-index': 'hub.context-index.v1.json',
  'sdkwork.hub.train': 'hub.train.v1.json',
  'sdkwork.hub.mcp-tools': 'hub.mcp-tools.v1.json',
};

const SECRET_PATTERNS = [
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ['openai-key', /\bsk-[A-Za-z0-9]{20,}\b/],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
];

const ABSOLUTE_PATH_PATTERNS = [
  ['windows-user-path', /[A-Za-z]:\\Users\\/],
  ['posix-home-path', /\/home\/[A-Za-z0-9._-]+\//],
];

function violation(code, file, message) {
  return { code, path: file, message };
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (item) meta[item[1]] = item[2].replace(/^["']|["']$/g, '');
  }
  return meta;
}

function gateBase() {
  const violations = [];
  for (const file of REQUIRED_BASELINE) {
    if (!exists(file)) violations.push(violation('BASE', file, 'missing baseline file'));
  }
  if (exists('README.md') && !/repository-kind:\s*standards/.test(readText('README.md'))) {
    violations.push(violation('BASE', 'README.md', 'missing "repository-kind: standards" declaration'));
  }
  for (const file of ['docs/README.md', 'docs/product/prd/PRD.md', 'docs/architecture/tech/TECH_ARCHITECTURE.md']) {
    if (exists(file) && !/\.md$/.test(file)) continue;
  }
  return { id: 'BASE', violations, notes: [] };
}

function gateSpec() {
  const violations = [];
  const index = exists('specs/README.md') ? readText('specs/README.md') : null;
  if (index === null) violations.push(violation('SPEC', 'specs/README.md', 'missing spec index'));
  for (const name of REQUIRED_SPECS) {
    const file = `specs/${name}.md`;
    if (!exists(file)) {
      violations.push(violation('SPEC', file, 'missing hub standard'));
      continue;
    }
    const text = readText(file);
    if (!/^- Version:/m.test(text)) violations.push(violation('SPEC', file, 'missing Version header'));
    if (!/^## .*Verification/m.test(text)) violations.push(violation('SPEC', file, 'missing Verification section'));
    if (index && !index.includes(`${name}.md`)) violations.push(violation('SPEC', file, 'not linked from specs/README.md'));
  }
  return { id: 'SPEC', violations, notes: [] };
}

function loadSchemas() {
  const schemas = new Map();
  for (const file of walk('schemas', { extensions: ['.json'] })) {
    const parsed = readJson(file);
    if (!parsed.ok) continue;
    schemas.set(path.basename(file), parsed.value);
  }
  return schemas;
}

function gateSchema() {
  const violations = [];
  const schemas = loadSchemas();
  for (const file of walk('schemas', { extensions: ['.json'] })) {
    const parsed = readJson(file);
    if (!parsed.ok) {
      violations.push(violation('SCH', file, `invalid JSON: ${parsed.error}`));
      continue;
    }
    if (!parsed.value.$schema) violations.push(violation('SCH', file, 'missing $schema'));
    if (!parsed.value.$id) violations.push(violation('SCH', file, 'missing $id'));
  }
  for (const schemaName of Object.values(KIND_SCHEMA)) {
    if (!schemas.has(schemaName)) violations.push(violation('SCH', `schemas/${schemaName}`, 'schema for declared kind is missing'));
  }

  const targets = ['catalog/index.json', 'sdks/lock.json', 'context/index.json'];
  for (const file of [...targets, ...walk('catalog', { extensions: ['.json'] }), ...walk('context', { extensions: ['.json'] })]) {
    if (!exists(file)) continue;
    const parsed = readJson(file);
    if (!parsed.ok) {
      violations.push(violation('SCH', file, `invalid JSON: ${parsed.error}`));
      continue;
    }
    const kind = parsed.value.kind;
    const schemaName = KIND_SCHEMA[kind];
    if (!schemaName) {
      violations.push(violation('SCH', file, `unknown artifact kind "${String(kind)}"`));
      continue;
    }
    const schema = schemas.get(schemaName);
    if (!schema) continue;
    for (const failed of validate(schema, parsed.value)) {
      violations.push(violation('SCH', file, `${failed.path}: ${failed.message}`));
    }
  }
  return { id: 'SCH', violations, notes: [] };
}

function gitOutput(args) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  return { status: result.status, stdout: (result.stdout ?? '').trim(), stderr: (result.stderr ?? '').trim() };
}

function gateLink({ linked = false } = {}) {
  const violations = [];
  const notes = [];
  const lockPath = 'sdks/lock.json';
  if (!exists(lockPath)) {
    violations.push(violation('LINK', lockPath, 'missing link lock'));
    return { id: 'LINK', violations, notes };
  }
  const parsedLock = readJson(lockPath);
  if (!parsedLock.ok) {
    violations.push(violation('LINK', lockPath, `invalid JSON: ${parsedLock.error}`));
    return { id: 'LINK', violations, notes };
  }
  const repos = Array.isArray(parsedLock.value.repos) ? parsedLock.value.repos : [];
  const modules = repos.map((repo) => repo.module);
  const sorted = [...modules].sort();
  if (JSON.stringify(modules) !== JSON.stringify(sorted)) {
    violations.push(violation('LINK', lockPath, 'repos are not sorted by module'));
  }
  if (new Set(modules).size !== modules.length) {
    violations.push(violation('LINK', lockPath, 'duplicate module entries'));
  }

  const gitmodules = exists('.gitmodules') ? readText('.gitmodules') : '';
  const declared = [...gitmodules.matchAll(/^\s*path\s*=\s*(\S+)\s*$/gm)].map((match) => match[1]);
  for (const declaredPath of declared) {
    if (!declaredPath.startsWith('sdks/')) {
      violations.push(violation('LINK', '.gitmodules', `gitlink path outside sdks/: ${declaredPath}`));
    }
  }
  const lockPaths = new Set(repos.map((repo) => repo.path));
  for (const declaredPath of declared) {
    if (!lockPaths.has(declaredPath)) violations.push(violation('LINK', '.gitmodules', `gitlink without lock entry: ${declaredPath}`));
  }
  for (const repo of repos) {
    if (!declared.includes(repo.path) && declared.length > 0) {
      violations.push(violation('LINK', lockPath, `lock entry without gitlink: ${repo.path}`));
    }
  }

  if (exists('.git')) {
    const listed = gitOutput(['ls-files', '-s', '--', 'sdks']);
    if (listed.status === 0) {
      const gitlinks = listed.stdout
        .split(/\r?\n/)
        .filter((line) => line.startsWith('160000'))
        .map((line) => line.replace(/^160000\s+[0-9a-f]+\s+\d+\t/, ''));
      for (const gitlink of gitlinks) {
        if (!lockPaths.has(gitlink)) violations.push(violation('LINK', gitlink, 'gitlink not recorded in lock'));
      }
    }
  }

  if (linked) {
    for (const repo of repos) {
      const target = abs(repo.path);
      if (!exists(`${repo.path}/.git`) && !exists(`${repo.path}/HEAD`)) {
        notes.push(`LINK: ${repo.path}: not materialized`);
        continue;
      }
      const head = gitOutput(['-C', repo.path, 'rev-parse', 'HEAD']);
      if (head.status !== 0) {
        violations.push(violation('LINK', repo.path, 'cannot read checkout HEAD'));
        continue;
      }
      if (head.stdout !== repo.commit) {
        violations.push(violation('LINK', repo.path, `HEAD ${head.stdout} does not match pin ${repo.commit}`));
      }
    }
  }
  return { id: 'LINK', violations, notes };
}

function gateCatalog() {
  const violations = [];
  const notes = [];
  const indexFile = 'catalog/index.json';
  if (!exists(indexFile)) {
    violations.push(violation('CAT', indexFile, 'missing catalog index'));
    return { id: 'CAT', violations, notes };
  }
  const parsed = readJson(indexFile);
  if (!parsed.ok) {
    violations.push(violation('CAT', indexFile, `invalid JSON: ${parsed.error}`));
    return { id: 'CAT', violations, notes };
  }
  const index = parsed.value;
  for (const file of walk('catalog', { extensions: ['.json'] })) {
    if (file === indexFile) continue;
    const artifact = readJson(file);
    if (!artifact.ok) {
      violations.push(violation('CAT', file, `invalid JSON: ${artifact.error}`));
      continue;
    }
    if (artifact.value.generated !== true) violations.push(violation('CAT', file, 'missing "generated": true'));
    if (artifact.value.schemaVersion !== 1) violations.push(violation('CAT', file, 'missing schemaVersion 1'));
  }

  const artifacts = Array.isArray(index.artifacts) ? index.artifacts : [];
  const artifactPaths = new Set(artifacts.map((artifact) => artifact.path));
  for (const artifact of artifacts) {
    if (!exists(artifact.path)) {
      violations.push(violation('CAT', artifact.path, 'artifact listed but missing'));
      continue;
    }
    if (artifact.sha256 !== fileSha256(artifact.path)) {
      violations.push(violation('CAT', artifact.path, 'artifact hash mismatch'));
    }
  }
  for (const file of walk('catalog', { extensions: ['.json'] })) {
    if (file === indexFile) continue;
    if (!artifactPaths.has(file)) violations.push(violation('CAT', file, 'artifact not listed in catalog/index.json'));
  }

  const counts = index.counts ?? {};
  const actual = {
    modules: walk('catalog/modules', { extensions: ['.json'] }).length,
    sdkProjects: walk('catalog/sdks', { extensions: ['.json'] }).length,
    apiAuthorities: walk('catalog/apis', { extensions: ['.json'] }).length,
    operations: walk('catalog/operations', { extensions: ['.json'] }).length,
  };
  for (const [key, value] of Object.entries(actual)) {
    if (counts[key] !== value) violations.push(violation('CAT', indexFile, `counts.${key} is ${counts[key]}, expected ${value}`));
  }

  const entityCount = actual.modules + actual.sdkProjects + actual.apiAuthorities;
  if (entityCount > 0 && !index.compiledAt) violations.push(violation('CAT', indexFile, 'entities exist but compiledAt is null'));
  if (index.compiledAt) {
    const ageDays = (Date.now() - Date.parse(index.compiledAt)) / 86_400_000;
    if (Number.isFinite(ageDays) && ageDays > 7) notes.push(`CAT: catalog is stale (${ageDays.toFixed(1)} days); recompile before release`);
  }
  return { id: 'CAT', violations, notes };
}

function gateContext() {
  const violations = [];
  const notes = [];
  const indexFile = 'context/index.json';
  if (!exists(indexFile)) {
    violations.push(violation('CTX', indexFile, 'missing context index'));
    return { id: 'CTX', violations, notes };
  }
  const parsed = readJson(indexFile);
  if (!parsed.ok) {
    violations.push(violation('CTX', indexFile, `invalid JSON: ${parsed.error}`));
    return { id: 'CTX', violations, notes };
  }
  const index = parsed.value;
  const skillDirs = listDirs('context/skills');
  for (const name of REQUIRED_SKILLS) {
    if (!skillDirs.includes(name)) violations.push(violation('CTX', `context/skills/${name}`, 'required skill missing'));
  }
  const indexedSkills = new Set((index.skills ?? []).map((skill) => skill.name));
  for (const name of skillDirs) {
    if (!indexedSkills.has(name)) violations.push(violation('CTX', `context/skills/${name}`, 'skill not listed in context/index.json'));
    const file = `context/skills/${name}/SKILL.md`;
    if (!exists(file)) {
      violations.push(violation('CTX', `context/skills/${name}`, 'missing SKILL.md'));
      continue;
    }
    const meta = parseFrontmatter(readText(file));
    if (!meta) {
      violations.push(violation('CTX', file, 'missing YAML frontmatter'));
      continue;
    }
    if (meta.name !== name) violations.push(violation('CTX', file, `frontmatter name "${meta.name}" does not match directory`));
    if (!meta.description) violations.push(violation('CTX', file, 'missing frontmatter description'));
  }
  for (const skill of index.skills ?? []) {
    if (!skillDirs.includes(skill.name)) violations.push(violation('CTX', indexFile, `skill "${skill.name}" listed but missing`));
    if (skill.path !== `context/skills/${skill.name}/SKILL.md`) violations.push(violation('CTX', indexFile, `skill "${skill.name}" has a non-standard path`));
  }
  for (const reference of index.references ?? []) {
    if (!exists(reference.path)) {
      violations.push(violation('CTX', reference.path, 'reference listed but missing'));
      continue;
    }
    if (Number(reference.tokens) > 6000) violations.push(violation('CTX', reference.path, `reference exceeds 6000-token budget (${reference.tokens})`));
  }
  for (const recipe of index.recipes ?? []) {
    if (!exists(recipe.path)) {
      violations.push(violation('CTX', recipe.path, 'recipe listed but missing'));
      continue;
    }
    const text = readText(recipe.path);
    if (!/## Verification|\bnode \b|\bpnpm \b|\bcargo \b|\bflutter test\b|\bgo test\b/.test(text)) {
      violations.push(violation('CTX', recipe.path, 'recipe has no verification command'));
    }
  }
  for (const blueprint of index.blueprints ?? []) {
    if (!exists(blueprint.path)) violations.push(violation('CTX', blueprint.path, 'blueprint listed but missing'));
  }
  if (index.generated !== true) violations.push(violation('CTX', indexFile, 'context index must be generated'));
  if (!index.compiledAt && (index.references ?? []).length > 0) violations.push(violation('CTX', indexFile, 'references exist but compiledAt is null'));
  return { id: 'CTX', violations, notes };
}

function gateMcp() {
  const violations = [];
  const notes = [];
  const packageFile = 'mcp/package.json';
  if (!exists(packageFile)) {
    violations.push(violation('MCP', packageFile, 'missing MCP package'));
  } else {
    const parsed = readJson(packageFile);
    if (!parsed.ok) violations.push(violation('MCP', packageFile, `invalid JSON: ${parsed.error}`));
    else {
      if (parsed.value.name !== '@sdkwork/hub-mcp') violations.push(violation('MCP', packageFile, 'package name must be @sdkwork/hub-mcp'));
      if (parsed.value.type !== 'module') violations.push(violation('MCP', packageFile, 'package must be an ES module'));
    }
  }
  const specFile = 'mcp/specs/component.spec.json';
  if (!exists(specFile)) violations.push(violation('MCP', specFile, 'missing component spec'));
  else if (!readJson(specFile).ok) violations.push(violation('MCP', specFile, 'invalid JSON'));

  const readme = 'mcp/README.md';
  if (!exists(readme)) violations.push(violation('MCP', readme, 'missing MCP README'));
  else {
    const text = readText(readme);
    for (const tool of ['sdk_search', 'api_search', 'sdk_get', 'api_operations', 'operation_get', 'integration_plan', 'recipe_get', 'usage_check', 'train_get', 'doc_read']) {
      if (!text.includes(tool)) violations.push(violation('MCP', readme, `tool contract missing "${tool}"`));
    }
    if (!/read-only/i.test(text)) violations.push(violation('MCP', readme, 'README must state the server is read-only'));
  }
  return { id: 'MCP', violations, notes };
}

function loadAllowlist() {
  const parsed = readJson('tools/verify/allowlist.json');
  return parsed.ok && Array.isArray(parsed.value.entries) ? parsed.value.entries : [];
}

function isAllowed(allowlist, code, file, message) {
  return allowlist.some((entry) =>
    entry.code === code &&
    (!entry.path || entry.path === file) &&
    (!entry.pattern || message.includes(entry.pattern)) &&
    (!entry.expires || Date.parse(entry.expires) > Date.now()));
}

function gateHygiene() {
  const violations = [];
  const allowlist = loadAllowlist();
  const files = walk('.', {
    skip: ['node_modules', '.git', '.hub-cache', 'dist', 'coverage', 'sdks', 'examples'],
    extensions: ['.md', '.json', '.mjs', '.ts', '.yaml', '.yml', '.txt', '.sh', '.ps1', '.cmd'],
  });
  for (const file of files) {
    const text = readText(file);
    for (const [name, pattern] of SECRET_PATTERNS) {
      if (pattern.test(text) && !isAllowed(allowlist, 'HYG', file, name)) {
        violations.push(violation('HYG', file, `possible secret (${name})`));
      }
    }
    for (const [name, pattern] of ABSOLUTE_PATH_PATTERNS) {
      if (pattern.test(text) && !isAllowed(allowlist, 'HYG', file, name)) {
        violations.push(violation('HYG', file, `machine-local absolute path (${name})`));
      }
    }
  }
  return { id: 'HYG', violations, notes: [] };
}

export function runGates({ linked = false } = {}) {
  return [
    gateBase(),
    gateSpec(),
    gateSchema(),
    gateLink({ linked }),
    gateCatalog(),
    gateContext(),
    gateMcp(),
    gateHygiene(),
  ];
}

export function reportGates(gates) {
  const failed = gates.filter((gate) => gate.violations.length > 0);
  const warnings = gates.reduce((total, gate) => total + (gate.notes?.length ?? 0), 0);
  console.log(`verify: ${gates.length} gates, ${gates.length - failed.length} passed, ${failed.length} failed${warnings ? `, ${warnings} warning(s)` : ''}`);
  for (const gate of gates) {
    console.log(`${gate.id}: ${gate.violations.length === 0 ? 'pass' : 'fail'}`);
    for (const note of gate.notes ?? []) console.log(`  ${note}`);
    for (const item of gate.violations) {
      console.log(`  ${item.code}: ${item.path}: ${item.message}`);
    }
  }
  return failed.length === 0 ? 0 : 1;
}
