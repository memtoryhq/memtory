import type { APIRoute } from 'astro';
import { pages, lastmod } from '../lib/pages';
import { SITE } from '../lib/seo';

export const GET: APIRoute = () => {
  const urls = Object.values(pages).map((page) => {
    const mod = lastmod(page);
    return [
      '  <url>',
      `    <loc>${new URL(page.path, SITE).href}</loc>`,
      ...(mod ? [`    <lastmod>${mod}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  });
  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      '</urlset>',
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
