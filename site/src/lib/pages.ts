// Every public page, in one place: the sitemap, llms.txt and each page's
// <title>/description read from here, so they can never disagree.
import { execFileSync } from 'node:child_process';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  /** Repo-relative files whose last commit dates this page's content. */
  sources: string[];
}

export const pages = {
  home: {
    path: '/',
    title: 'Memtory: the project manager for your AI coding agents',
    description:
      'Memtory scans a repository, writes a shared roadmap, backlog and decision log into .ai/, and lets agents like Claude Code claim tasks and record why.',
    sources: ['site/src/pages/index.astro', 'facts.md'],
  },
  facts: {
    path: '/facts/',
    title: "Memtory facts: what it is, what's live, what's coming, pricing",
    description:
      'The canonical public facts about Memtory: what it is, what is live today, what is coming soon, pricing and links. The same text the CLI and MCP server return.',
    sources: ['site/src/pages/facts/index.astro', 'facts.md'],
  },
} satisfies Record<string, PageMeta>;

/**
 * The newest last-commit date across a page's sources (YYYY-MM-DD), or null
 * if none are committed yet. Never the build time: lastmod must mean the
 * content changed. CI needs a full clone (fetch-depth: 0) for this.
 */
export function lastmod(page: PageMeta): string | null {
  const dates = page.sources
    .map((file) =>
      // :(top) resolves the path from the repo root, wherever the build runs.
      execFileSync('git', ['log', '-1', '--format=%cs', '--', `:(top)${file}`], { encoding: 'utf8' }).trim(),
    )
    .filter(Boolean)
    .sort();
  return dates.at(-1) ?? null;
}
