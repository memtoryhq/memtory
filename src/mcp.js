import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadFacts, version } from './facts.js';

export function createServer() {
  const server = new McpServer({ name: 'memtory', version: version() });

  server.registerTool(
    'memtory_about',
    {
      title: 'About Memtory',
      description:
        'Returns public facts about Memtory: what it is, what is live, what is coming soon, pricing and links.',
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => ({ content: [{ type: 'text', text: loadFacts() }] }),
  );

  return server;
}

export async function runStdio() {
  await createServer().connect(new StdioServerTransport());
}
