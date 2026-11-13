import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const GENERATED = Object.freeze({ true: true });

const DEFAULT_SKIP = ['node_modules', '.git', '.hub-cache', 'dist', 'coverage'];

export function abs(relativePath) {
  return path.isAbsolute(relativePath) ? relativePath : path.join(ROOT, relativePath);
}

export function rel(absolutePath) {
  return path.relative(ROOT, absolutePath).split(path.sep).join('/');
}

export function exists(relativePath) {
  return existsSync(abs(relativePath));
}

export function readText(relativePath) {
  return readFileSync(abs(relativePath), 'utf8');
}

export function readJson(relativePath) {
  try {
    return { ok: true, value: JSON.parse(readText(relativePath)) };
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    return { ok: false, error: message };
  }
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function fileSha256(relativePath) {
  return sha256(readFileSync(abs(relativePath)));
}

export function walk(relativeDir, { skip = DEFAULT_SKIP, extensions = null } = {}) {
  const base = abs(relativeDir);
  const out = [];
  if (!existsSync(base)) return out;
  const visit = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (skip.includes(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(full);
      } else if (entry.isFile()) {
        if (extensions && !extensions.some((extension) => entry.name.endsWith(extension))) continue;
        out.push(rel(full));
      }
    }
  };
  visit(base);
  return out.sort();
}

export function listDirs(relativeDir) {
  const base = abs(relativeDir);
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function nowIso() {
  return new Date().toISOString();
}

export function tokenEstimate(text) {
  return Math.ceil(text.length / 4);
}

export function toPosix(value) {
  return value.split(path.sep).join('/');
}
