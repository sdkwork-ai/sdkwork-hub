import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
}

test('hub verify passes on the initialized repository', () => {
  const result = run(['tools/hub.mjs', 'verify']);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /verify: 8 gates/);
});

test('hub verify emits a stable gate summary', () => {
  const result = run(['tools/hub.mjs', 'verify']);
  for (const gate of ['BASE', 'SPEC', 'SCH', 'LINK', 'CAT', 'CTX', 'MCP', 'HYG']) {
    assert.match(result.stdout, new RegExp(`^${gate}: `, 'm'));
  }
});

test('hub info reads the committed catalog index', () => {
  const result = run(['tools/hub.mjs', 'info']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /sdkwork-hub/);
});

test('schema validator rejects a missing required property', async () => {
  const { validate } = await import('../tools/lib/schema.mjs');
  const schema = {
    type: 'object',
    required: ['kind'],
    properties: { kind: { const: 'x' } },
    additionalProperties: false,
  };
  assert.equal(validate(schema, { kind: 'x' }).length, 0);
  assert.equal(validate(schema, {}).length, 1);
  assert.equal(validate(schema, { kind: 'y' }).length, 1);
  assert.equal(validate(schema, { kind: 'x', extra: true }).length, 1);
});
