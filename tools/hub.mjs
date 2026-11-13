#!/usr/bin/env node
import { readJson } from './lib/util.mjs';
import { reportGates, runGates } from './lib/verify.mjs';
import { linkAdd, linkList, linkStatus, linkUpdate } from './lib/link.mjs';
import { artifactCheck } from './lib/artifacts.mjs';

function usage() {
  console.log(`sdkwork-hub <command>

Commands:
  verify [--linked]           Run repository and artifact gates
  info                        Print catalog, pin, and context summary
  link list                   List pinned repositories
  link add <module> [--url <url>] [--ref <ref>]
  link update <module> [--ref <ref>]
  link status                 Compare checkout HEADs with pins
  catalog check               Check committed catalog artifacts
  context check               Check committed context artifacts

Examples:
  node tools/hub.mjs verify
  node tools/hub.mjs link add sdkwork-iam
`);
}

function info() {
  const catalog = readJson('catalog/index.json');
  const lock = readJson('sdks/lock.json');
  if (!catalog.ok) {
    console.log(`catalog: unavailable (${catalog.error})`);
    return 1;
  }
  const counts = catalog.value.counts ?? {};
  console.log('sdkwork-hub');
  console.log(`  compiledAt: ${catalog.value.compiledAt ?? 'never'}`);
  console.log(`  pins: ${lock.ok ? lock.value.repos.length : 'unavailable'}`);
  console.log(`  modules: ${counts.modules ?? 0}`);
  console.log(`  sdk projects: ${counts.sdkProjects ?? 0}`);
  console.log(`  api authorities: ${counts.apiAuthorities ?? 0}`);
  console.log(`  operations: ${counts.operations ?? 0}`);
  console.log(`  packages: ${counts.packages ?? 0}`);
  const maturity = catalog.value.maturity ?? {};
  console.log(`  maturity: L0=${maturity.l0 ?? 0} L1=${maturity.l1 ?? 0} L2=${maturity.l2 ?? 0} L3=${maturity.l3 ?? 0}`);
  return 0;
}

function optionalValue(args, index) {
  const value = args[index];
  if (!value || value.startsWith('--')) throw new Error(`missing value for ${args[index - 1]}`);
  return value;
}

async function main(argv) {
  const [command, subcommand, ...rest] = argv;
  try {
    switch (command) {
      case 'verify': {
        const linked = argv.includes('--linked');
        return reportGates(runGates({ linked }));
      }
      case 'info':
        return info();
      case 'link': {
        if (subcommand === 'list') return linkList();
        if (subcommand === 'status') return linkStatus();
        if (subcommand === 'add') {
          const module = optionalValue([subcommand, ...rest], 1);
          const urlIndex = rest.indexOf('--url');
          const refIndex = rest.indexOf('--ref');
          return linkAdd(module, {
            url: urlIndex >= 0 ? optionalValue(rest, urlIndex + 1) : undefined,
            ref: refIndex >= 0 ? optionalValue(rest, refIndex + 1) : undefined,
          });
        }
        if (subcommand === 'update') {
          const module = optionalValue([subcommand, ...rest], 1);
          const refIndex = rest.indexOf('--ref');
          return linkUpdate(module, { ref: refIndex >= 0 ? optionalValue(rest, refIndex + 1) : undefined });
        }
        usage();
        return 2;
      }
      case 'catalog':
        if (subcommand === 'check') return artifactCheck('catalog');
        usage();
        return 2;
      case 'context':
        if (subcommand === 'check') return artifactCheck('context');
        usage();
        return 2;
      case 'help':
      case '--help':
      case '-h':
      case undefined:
        usage();
        return 0;
      default:
        console.error(`unknown command: ${command}`);
        usage();
        return 2;
    }
  } catch (error) {
    console.error(`hub: ${error.message}`);
    return 1;
  }
}

process.exitCode = await main(process.argv.slice(2));
