import { readFileSync } from 'node:fs';

// facts.md is the single source of public facts: the CLI, the MCP tool and
// (later) memtory.com/facts all render it, so they can never disagree.
export function loadFacts() {
  return readFileSync(new URL('../facts.md', import.meta.url), 'utf8');
}

export function version() {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  return pkg.version;
}
