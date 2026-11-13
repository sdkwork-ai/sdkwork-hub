import { runGates, reportGates } from './verify.mjs';

export function artifactCheck(kind) {
  const gates = runGates({ linked: false });
  const selected = kind === 'catalog'
    ? gates.filter((gate) => ['SCH', 'CAT'].includes(gate.id))
    : gates.filter((gate) => ['SCH', 'CTX'].includes(gate.id));
  const status = reportGates(selected);
  if (kind === 'catalog') {
    console.log('catalog: checked committed artifacts (compile step is delivered by P1)');
  } else {
    console.log('context: checked committed artifacts (generation step is delivered by P2)');
  }
  return status;
}
