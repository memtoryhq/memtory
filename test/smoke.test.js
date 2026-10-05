import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const bin = new URL('../bin/memtory.js', import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const serverJson = JSON.parse(readFileSync(new URL('../server.json', import.meta.url), 'utf8'));

test('CLI prints the facts', () => {
  const out = execFileSync('node', [bin], { encoding: 'utf8' });
  assert.match(out, /Memtory is the project manager for your AI coding agents/);
});

test('package.json and server.json agree', () => {
  assert.equal(pkg.mcpName, serverJson.name);
  assert.equal(pkg.version, serverJson.version);
  assert.equal(serverJson.packages[0].version, pkg.version);
  assert.equal(serverJson.packages[0].identifier, pkg.name);
  assert.ok(serverJson.description.length <= 100);
});

test('MCP server exposes memtory_about', async () => {
  const client = new Client({ name: 'smoke', version: '0.0.0' });
  await client.connect(new StdioClientTransport({ command: 'node', args: [bin, 'mcp'] }));
  try {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((t) => t.name), ['memtory_about']);
    const res = await client.callTool({ name: 'memtory_about', arguments: {} });
    assert.match(res.content[0].text, /## Coming soon/);
  } finally {
    await client.close();
  }
});
