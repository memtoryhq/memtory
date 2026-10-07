// The CLI, the memtory_about MCP tool and the built /facts page must all carry
// the canonical definition from facts.md, word for word. Run after `astro build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const bin = new URL('bin/memtory.js', root).pathname;
const factsMd = readFileSync(new URL('facts.md', root), 'utf8');

// Compared as plain text: markdown code ticks and HTML tags are presentation.
const plain = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/`/g, '')
    .replace(/\s+/g, ' ');

const definitionLine = factsMd.split('\n').find((l) => l.startsWith('> '));
assert.ok(definitionLine, 'facts.md has a "> " definition line');
const definition = plain(definitionLine.slice(2)).trim();

const liveItems = factsMd
  .split('## Live today')[1]
  .split('\n## ')[0]
  .split('\n')
  .filter((l) => l.startsWith('- '))
  .map((l) => plain(l.slice(2)).trim());

const factsHtml = plain(readFileSync(new URL('site/dist/facts/index.html', root), 'utf8'));

test('CLI output carries the canonical definition', () => {
  const out = execFileSync('node', [bin], { encoding: 'utf8' });
  assert.ok(plain(out).includes(definition));
});

test('memtory_about MCP tool carries the canonical definition', async () => {
  const text = await callAbout();
  assert.ok(plain(text).includes(definition));
});

test('/facts page carries the canonical definition', () => {
  assert.ok(factsHtml.includes(definition));
});

test('/facts page lists every live item', () => {
  for (const item of liveItems) assert.ok(factsHtml.includes(item), `missing: ${item}`);
});

// Minimal MCP client over stdio (newline-delimited JSON-RPC), so the site does
// not need the MCP SDK as a dependency.
function callAbout() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [bin, 'mcp'], { stdio: ['pipe', 'pipe', 'inherit'] });
    const send = (msg) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\n');
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('MCP server did not answer within 10s'));
    }, 10_000);
    let buf = '';
    child.stdout.on('data', (chunk) => {
      buf += chunk;
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const msg = JSON.parse(buf.slice(0, nl));
        buf = buf.slice(nl + 1);
        if (msg.id === 1) {
          send({ method: 'notifications/initialized' });
          send({ id: 2, method: 'tools/call', params: { name: 'memtory_about', arguments: {} } });
        } else if (msg.id === 2) {
          clearTimeout(timer);
          child.kill();
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result.content[0].text);
        }
      }
    });
    send({
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'parity', version: '0' } },
    });
  });
}
