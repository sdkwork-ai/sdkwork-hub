import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, abs, exists, listDirs, readJson, rel } from './util.mjs';

const LOCK_FILE = 'sdks/lock.json';
const MODULE_PATTERN = /^sdkwork-[a-z0-9-]+$/;

function git(args, options = {}) {
  const result = spawnSync('git', args, { cwd: options.cwd ?? ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || `git ${args.join(' ')} failed`).trim();
    throw new Error(message);
  }
  return (result.stdout ?? '').trim();
}

function readLock() {
  const parsed = readJson(LOCK_FILE);
  if (!parsed.ok) throw new Error(`${LOCK_FILE}: ${parsed.error}`);
  return parsed.value;
}

function writeLock(lock) {
  const sorted = [...lock.repos].sort((left, right) => left.module.localeCompare(right.module));
  const next = { ...lock, repos: sorted };
  fs.writeFileSync(abs(LOCK_FILE), `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

function repoPath(module) {
  return `sdks/modules/${module}`;
}

function ensureGitRepository() {
  if (!exists('.git')) throw new Error('this directory is not a git repository; run "git init -b main" first');
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== 'main') throw new Error(`link changes require branch main (current: ${branch})`);
}

function findFamilies(target) {
  return listDirs(path.join(target, 'sdks')).filter((name) => MODULE_PATTERN.test(name.replace(/-sdk$/, '')) && name.endsWith('-sdk'));
}

export function linkList() {
  const lock = readLock();
  if (lock.repos.length === 0) {
    console.log('link: no pinned repositories');
    return 0;
  }
  console.log('module\tstage\tcommit\tfamilies\tpath');
  for (const repo of lock.repos) {
    console.log(`${repo.module}\t${repo.stage}\t${repo.commit.slice(0, 12)}\t${repo.sdkFamilies.length}\t${repo.path}`);
  }
  return 0;
}

export function linkAdd(module, options = {}) {
  if (!MODULE_PATTERN.test(module)) throw new Error(`invalid module name: ${module}`);
  ensureGitRepository();
  const target = repoPath(module);
  if (exists(target)) throw new Error(`link already exists: ${target}`);
  const lock = readLock();
  if (lock.repos.some((repo) => repo.module === module)) throw new Error(`module already pinned: ${module}`);

  const url = options.url ?? `https://github.com/sdkwork-ai/${module}.git`;
  console.log(`link: adding ${module} -> ${url}`);
  git(['submodule', 'add', url, target]);
  if (options.ref) {
    git(['-C', target, 'fetch', 'origin']);
    git(['-C', target, 'checkout', options.ref]);
    git(['add', target]);
  }
  try {
    git(['-C', target, 'sparse-checkout', 'set', 'sdks']);
  } catch {
    console.warn('link: sparse checkout unavailable for this checkout; continuing with a full worktree');
  }
  const commit = git(['-C', target, 'rev-parse', 'HEAD']);
  const sdkFamilies = findFamilies(target);
  lock.repos.push({ module, stage: 1, url, path: target, commit, sdkFamilies });
  writeLock(lock);
  console.log(`link: pinned ${module} at ${commit} (${sdkFamilies.length} SDK families)`);
  return 0;
}

export function linkUpdate(module, options = {}) {
  if (!MODULE_PATTERN.test(module)) throw new Error(`invalid module name: ${module}`);
  ensureGitRepository();
  const target = repoPath(module);
  if (!exists(target)) throw new Error(`link not materialized: ${target}`);
  const lock = readLock();
  const entry = lock.repos.find((repo) => repo.module === module);
  if (!entry) throw new Error(`module not pinned: ${module}`);

  git(['-C', target, 'fetch', 'origin', '--tags']);
  const ref = options.ref ?? 'origin/main';
  git(['-C', target, 'checkout', ref]);
  const commit = git(['-C', target, 'rev-parse', 'HEAD']);
  entry.commit = commit;
  entry.sdkFamilies = findFamilies(target);
  writeLock(lock);
  git(['add', target]);
  console.log(`link: updated ${module} to ${commit} (${entry.sdkFamilies.length} SDK families)`);
  return 0;
}

export function linkStatus() {
  const lock = readLock();
  let drift = 0;
  for (const repo of lock.repos) {
    const target = repoPath(repo.module);
    if (!exists(target)) {
      console.log(`missing\t${repo.module}\tnot materialized`);
      continue;
    }
    try {
      const head = git(['-C', target, 'rev-parse', 'HEAD']);
      if (head !== repo.commit) {
        drift += 1;
        console.log(`drift\t${repo.module}\t${head} != ${repo.commit}`);
      }
    } catch (error) {
      console.log(`error\t${repo.module}\t${error.message}`);
    }
  }
  console.log(`link: ${lock.repos.length} pinned, ${drift} drifted`);
  return drift === 0 ? 0 : 1;
}
