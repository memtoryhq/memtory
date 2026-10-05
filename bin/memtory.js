#!/usr/bin/env node
import { loadFacts, version } from '../src/facts.js';

const HELP = `memtory ${version()}

Usage:
  npx memtory            Show what Memtory is, what's live and what's coming
  npx memtory mcp        Start the Memtory MCP server (stdio)
  npx memtory --version  Print the version

Add to Claude Code:
  claude mcp add memtory -- npx -y memtory mcp
`;

const [cmd] = process.argv.slice(2);

if (cmd === 'mcp') {
  const { runStdio } = await import('../src/mcp.js');
  await runStdio();
} else if (cmd === '--version' || cmd === '-v') {
  console.log(version());
} else if (cmd === '--help' || cmd === '-h') {
  console.log(HELP);
} else if (cmd === undefined) {
  console.log(loadFacts());
  console.log(HELP);
} else {
  console.error(`Unknown command: ${cmd}\n\n${HELP}`);
  process.exit(1);
}
