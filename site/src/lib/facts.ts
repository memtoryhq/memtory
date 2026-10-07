// facts.md (repo root) is the single source of public facts. The CLI, the MCP
// tool and this site all render it, so they can never disagree. It is read at
// build time; nothing here runs in the browser.
import raw from '../../../facts.md?raw';

export interface FactsSection {
  heading: string;
  items: string[];
}

export interface PricingTier {
  name: string;
  detail: string;
}

export interface Facts {
  title: string;
  /** The canonical definition, as written in facts.md (inline markdown kept). */
  definition: string;
  updated: string;
  status: string;
  sections: FactsSection[];
}

function parse(md: string): Facts {
  let title = '';
  let definition = '';
  let updated = '';
  let status = '';
  const sections: FactsSection[] = [];

  for (const line of md.split('\n').map((l) => l.trim())) {
    if (line.startsWith('# ')) title = line.slice(2);
    else if (line.startsWith('> ')) definition = line.slice(2);
    else if (line.startsWith('Updated: ')) updated = line.slice('Updated: '.length);
    else if (line.startsWith('Status: ')) status = line.slice('Status: '.length);
    else if (line.startsWith('## ')) sections.push({ heading: line.slice(3), items: [] });
    else if (line.startsWith('- ') && sections.length) sections.at(-1)!.items.push(line.slice(2));
  }

  if (!title || !definition || !updated) {
    throw new Error('facts.md is missing its title, definition (> line) or Updated: date');
  }
  return { title, definition, updated, status, sections };
}

export const facts = parse(raw);

export function section(heading: string): string[] {
  const found = facts.sections.find((s) => s.heading === heading);
  if (!found) throw new Error(`facts.md has no "## ${heading}" section`);
  return found.items;
}

export function pricing(): PricingTier[] {
  return section('Pricing').map((item) => {
    const i = item.indexOf(': ');
    return { name: item.slice(0, i), detail: item.slice(i + 2) };
  });
}

/** The definition as plain text, the form the parity test compares. */
export const definitionText = facts.definition.replace(/`/g, '');

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** facts.md only uses inline code and bare URLs, so that is all this renders. */
export function inline(md: string): string {
  return escape(md)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/https?:\/\/[^\s<)]+/g, (url) => `<a href="${url}">${url}</a>`);
}
