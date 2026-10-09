import type { APIRoute } from 'astro';
import { facts } from '../lib/facts';
import { pages } from '../lib/pages';
import { SITE } from '../lib/seo';

// https://llmstxt.org: a title, a one-line summary, then links to the pages.
export const GET: APIRoute = () =>
  new Response(
    [
      `# ${facts.title}`,
      '',
      `> ${facts.definition}`,
      '',
      `Status: ${facts.status} Try it now with \`npx memtory\`, or add the MCP server: \`claude mcp add memtory -- npx -y memtory mcp\`.`,
      '',
      '## Pages',
      '',
      ...Object.values(pages).map((p) => `- [${p.title}](${new URL(p.path, SITE).href}): ${p.description}`),
      '',
      '## Optional',
      '',
      `- [Everything in one file](${SITE}/llms-full.txt): the full facts and docs as plain markdown.`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
